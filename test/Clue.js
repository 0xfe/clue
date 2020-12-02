const Clue = artifacts.require("Clue")

contract("Clue", accounts => {
  it("should put 1000000000000 MetaCoin in the first account", async () => {
    const clue = await Clue.deployed()
    const balance = await clue.balanceOf.call(accounts[0])
    assert.equal(
      balance.valueOf(),
      1000000000000,
      "1000000000000 wasn't in the first account"
    );
  });

  it("should fail an incorrect solution", async () => {
    const clue = await Clue.deployed()

    await clue.resetClue("test 1", web3.utils.sha3("solution"))
    const result = await clue.solve.call("boo")
    assert.equal(result, false, "contract accepted an incorrect solution");
  });

  it("should accept a correct solution", async () => {
    const clue = await Clue.deployed()

    await clue.resetClue("test 1", web3.utils.sha3("solution"))
    const result = await clue.solve.call("solution")
    assert.equal(result, true, "contract rejected a correct solution");
  });

  it("should reward the solver's account", async () => {
    const clue = await Clue.deployed()

    await clue.resetClue("test 1", web3.utils.sha3("solution"))
    const originalBalance = await clue.balanceOf.call(accounts[1])
    const result = await clue.solve("solution", { from: accounts[1] })
    const finalBalance = await clue.balanceOf.call(accounts[1])
    assert.equal(finalBalance.valueOf(), 100, "contract did not reward solver's account");
  });

  it("should only reward one correct solution", async () => {
    const clue = await Clue.deployed()

    await clue.resetClue("test 1", web3.utils.sha3("solution"))
    const result = await clue.solve("solution", { from: accounts[2] })
    let hasError = false;
    try {
      const result2 = await clue.solve("solution", { from: accounts[2] })
    } catch (error) {
      hasError = true;
    }

    assert.equal(hasError, true, "contract did not throw error on second solution")

    const finalBalance = await clue.balanceOf.call(accounts[2])
    assert.equal(finalBalance.valueOf(), 100, "solver should only have one token");
  });
})
