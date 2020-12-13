import { Contract } from 'web3-eth-contract';
import Wallet, { ContractSpec } from './wallet';
import ClueContract from '../build/contracts/Clue.json';

function L(...args) {
  // eslint-disable-next-line
  console.log('clue.ts:', ...args);
}

class Clue {
  wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  contract(): Contract {
    return this.wallet.newContract(<ContractSpec>(<unknown>ClueContract));
  }

  async getClue(): Promise<string> {
    const contract = this.contract();
    const clue = await contract.methods._clue().call();
    L(clue);
    return clue;
  }

  async solved(): Promise<boolean> {
    const contract = this.contract();
    return await contract.methods._answered().call();
  }

  async testSolution(solution: string): Promise<boolean> {
    const contract = this.contract();
    const result = await contract.methods.solve(solution).call();
    L('testSolution(' + solution + '): ', result);
    return result;
  }

  async solve(solution: string): Promise<void> {
    const contract = this.contract();
    const result = await contract.methods.solve(solution).send({ from: this.wallet.getAccounts()[0] });
    L('solve(' + solution + '): ', result);
  }
}

export default Clue;
