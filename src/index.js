import './style.css';
import 'animate.css';
import ClueContract from '../build/contracts/Clue.json';
import Wallet from './wallet.ts';

function L(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

$(document).ready(() => {
  L('CTF: hello world!');
  L('Using ABI:', ClueContract.abi);

  const wallet = new Wallet();

  $('#solution').focus();
  $('#connect').click(async () => {
    await wallet.connect();
    $('#connect').prop('disabled', true);
    $('#connect').text(wallet.getAccounts()[0]);
  });

  $('#solve').click(async () => {
    const contract = wallet.getEth().Contract(ClueContract.abi, ClueContract.networks[wallet.networkID].address);
    contract.call('foo');
  });
});
