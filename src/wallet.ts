import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

function L(...args) {
  // eslint-disable-next-line
  console.log('wallet.ts:', ...args);
}

declare global {
  // eslint-ignore-next-line
  interface Window {
    ethereum: Web3;
  }
}

interface NewProvider extends AbstractProvider {
  on: (string, any) => void;
}

interface WalletParams {
  onAccountsChanged: (accounts: Array<string>) => void;
  onNetworkChanged: (network: number) => void;
}

interface ContractSpec {
  abi: AbiItem;
  networks: Array<{ address: string }>;
}

class Wallet {
  params: WalletParams;
  web3: Web3;
  connected: boolean;
  networkID: number;
  accounts: Array<string>;
  provider: NewProvider;

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
    L('Wallet: connecting...');
    if (!this.provider) {
      throw new Error('No Web3 provider found.');
    }

    this.accounts = await this.web3.eth.requestAccounts();
    this.networkID = await this.web3.eth.net.getId();
    L('networkID: ', this.networkID);
    L('accounts: ', this.accounts);

    this.params.onAccountsChanged(this.accounts);

    this.provider.on('accountsChanged', (accounts) => {
      L('accountsChanged', accounts);
      this.accounts = accounts;
      this.params.onAccountsChanged(accounts);
      if (this.accounts.length > 0) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });

    this.provider.on('chainChanged', (networkID) => {
      L('chainChanged: ', networkID);
      this.networkID = networkID;
    });
  }

  newContract(spec: ContractSpec): Contract {
    return new this.web3.eth.Contract(spec.abi, spec.networks[this.networkID].address);
  }

  getAccounts(): Array<string> {
    return this.accounts;
  }
}

export { Wallet as default, ContractSpec };
