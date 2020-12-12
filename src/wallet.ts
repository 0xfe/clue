import Web3 from 'web3';
import { provider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import ClueContract from '../build/contracts/Clue.json';

function L(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

declare global {
  // eslint-ignore-next-line
  interface Window {
    ethereum: Web3;
  }
}

interface WalletParams {
  onAccountsChanged: (accounts: Array<string>) => void;
  onNetworkChanged: (network: number) => void;
}

class Wallet {
  params: WalletParams;
  web3: Web3;
  connected: boolean;
  networkID: number;
  accounts: Array<string>;
  clueContract: Contract;
  provider: provider;

  constructor(params: WalletParams) {
    this.web3 = null;
    L('starting ethereum: ', params);
    $('#connect').prop('disabled', false);
    const provider = 'ethereum' in window ? window.ethereum : Web3.givenProvider;

    this.web3 = new Web3(provider);
    this.connected = false;
    this.networkID = 0;
    this.params = params;
    this.provider = provider;
  }

  async connect(): Promise<void> {
    if (!this.web3) {
      throw new Error('TODO - no web3');
    }

    this.provider.on('accountsChanged', (accounts) => {
      this.accounts = accounts;
      this.params.onAccountsChanged(accounts);
      if (this.accounts.length > 0) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });

    this.provider.on('networkChanged', (networkID) => {
      this.networkID = networkID;
      this.clueContract = new this.web3.eth.Contract(
        <AbiItem>(<unknown>ClueContract.abi),
        ClueContract.networks[this.networkID].address
      );
    });

    this.accounts = await this.web3.eth.requestAccounts();
  }

  getAccounts(): Array<string> {
    return this.accounts;
  }

  async testSolution(solution: string): Promise<boolean> {
    const result = await this.clueContract.methods.solve(solution).call();
    L('testSolution(' + solution + '): ', result);
    return result;
  }

  async solve(solution: string): Promise<void> {
    const result = await this.clueContract.methods.solve(solution).send({ from: this.accounts[0] });
    L('solve(' + solution + '): ', result);
  }
}

export default Wallet;
