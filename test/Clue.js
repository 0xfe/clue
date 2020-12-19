/* eslint no-undef: 0 */

const Clue = artifacts.require('Clue');

contract('Clue', (accounts) => {
  function makeCommitment(solution, account) {
    return web3.utils.keccak256(
      web3.utils.hexToBytes(account || accounts[0]).concat(web3.utils.hexToBytes(web3.utils.toHex(solution)))
    );
  }

  it('should put 1000000000000 FLAG in the first account', async () => {
    const clue = await Clue.deployed();
    const balance = await clue.balanceOf.call(accounts[0]);
    assert.equal(balance.valueOf(), 1000000000000, "1000000000000 wasn't in the first account");
  });

  it('should reject solutions without commitments', async () => {
    const clue = await Clue.deployed();
    await clue.resetClue('test 1', web3.utils.sha3('solution'));

    let hasError = false;
    try {
      await clue.solve.call('solution');
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, 'contract did not throw error on second solution');
  });

  it('should accept a commiteed correct solution', async () => {
    const clue = await Clue.deployed();
    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    await clue.commit(makeCommitment('solution'));

    const result = await clue.solve.call('solution');
    assert.equal(result, true, 'contract rejected a correct solution');
  });

  it('should fail a committed incorrect solution', async () => {
    const clue = await Clue.deployed();

    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    await clue.commit(makeCommitment('boo'));

    const result = await clue.solve.call('boo');
    assert.equal(result, false, 'contract accepted an incorrect solution');
  });

  it("should reject solutions not commited from the sender's account", async () => {
    const clue = await Clue.deployed();
    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    // Commit with accounts[1]
    await clue.commit(makeCommitment('solution', accounts[1]), { from: accounts[1] });

    let hasError = false;
    try {
      // Solve with accounts[0]
      await clue.solve.call('solution');
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, 'contract accepted solution that was commited by a different account');
  });

  it('should fail a correct solution with the wrong commitment', async () => {
    const clue = await Clue.deployed();

    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    await clue.commit(makeCommitment('boo'));

    let hasError = false;
    try {
      await clue.solve.call('solution');
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, 'contract accepted solution with an incorrect commitment');
  });

  it("should reward the solver's account", async () => {
    const clue = await Clue.deployed();

    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    await clue.commit(makeCommitment('solution', accounts[1]), { from: accounts[1] });

    await clue.balanceOf.call(accounts[1]);
    await clue.solve('solution', { from: accounts[1] });
    const finalBalance = await clue.balanceOf.call(accounts[1]);
    assert.equal(finalBalance.valueOf(), 100, "contract did not reward solver's account");
  });

  it('should only accept one correct solution', async () => {
    const clue = await Clue.deployed();

    await clue.resetClue('test 1', web3.utils.sha3('solution'));
    await clue.commit(makeCommitment('solution', accounts[2]), { from: accounts[2] });
    await clue.solve('solution', { from: accounts[2] });

    let hasError = false;
    try {
      await clue.commit(makeCommitment('solution', accounts[2]), { from: accounts[2] });
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, 'contract did not throw error on second commit');

    hasError = false;
    try {
      await clue.solve('solution', { from: accounts[2] });
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, 'contract did not throw error on second solution');

    const finalBalance = await clue.balanceOf.call(accounts[2]);
    assert.equal(finalBalance.valueOf(), 100, 'solver should only have one token');
  });
});
