import { Contract } from 'web3-eth-contract';
import Wallet, { ContractSpec } from './wallet';
import ClueContract from '../build/contracts/Clue.json';

function L(...args) {
  // eslint-disable-next-line
  console.log('clue.ts:', ...args);
}

class Clue {
  wallet: Wallet;
  clue: string;
  answerHash: string;
  commitment: string;
  solved: boolean;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  contract(): Contract {
    return this.wallet.newContract(<ContractSpec>(<unknown>ClueContract));
  }

  makeCommitment(solution: string): string {
    const web3 = this.wallet.web3;
    return web3.utils.keccak256(
      <string>(
        (<unknown>(
          web3.utils.hexToBytes(this.wallet.accounts[0]).concat(web3.utils.hexToBytes(web3.utils.toHex(solution)))
        ))
      )
    );
  }

  async getClue(): Promise<string> {
    const contract = this.contract();
    L('calling getClue()');
    const result = await contract.methods.getClue().call({ from: this.wallet.getAccounts()[0] });
    L('result', result);
    this.clue = result.c;
    this.answerHash = result.h;
    this.solved = result.a;
    this.commitment = result.commitment;
    L('getClue:', this.clue, this.answerHash, this.solved);
    return this.clue;
  }

  async testSolution(solution: string): Promise<boolean> {
    const web3 = this.wallet.web3;
    return web3.utils.keccak256(solution) == this.answerHash;
  }

  async commit(solution: string): Promise<void> {
    const commitment = this.makeCommitment(solution);
    const contract = this.contract();
    L('commit(' + commitment + ')...');
    const result = await contract.methods.commit(commitment).send({ from: this.wallet.getAccounts()[0] });
    L(result);
  }

  async solve(solution: string): Promise<void> {
    const contract = this.contract();
    const result = await contract.methods.solve(solution).send({ from: this.wallet.getAccounts()[0] });
    L('solve(' + solution + '): ', result);
  }
}

export default Clue;
