import Web3 from 'web3';
import {Eth} from 'web3-eth';

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

class Wallet {
  web3: Web3;

  connected: boolean;

  networkID: number;

  accounts: Array<string>;

  constructor() {
    this.web3 = null;
    L('starting ethereum..');
    $('#connect').prop('disabled', false);
    const provider = ('ethereum' in window) ? window.ethereum : Web3.givenProvider;
    this.web3 = new Web3(provider);
    this.connected = false;
    this.networkID = 0;
  }

  async connect() : Promise<void> {
    if (!this.web3) {
      throw new Error('TODO - no web3');
    }
    this.accounts = await this.web3.eth.requestAccounts();
    this.networkID = await this.web3.eth.net.getId();
    L('connected to network: ', this.networkID);
    this.connected = true;
  }

  getAccounts() : Array<string> {
    return this.accounts;
  }

  getEth() : Eth {
    return this.web3.eth;
  }
}

export default Wallet;
