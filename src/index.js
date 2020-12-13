import './style.css';
import 'animate.css';
import Wallet from './wallet.ts';
import { onEnterPressed } from './util.ts';

function L(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

$(document).ready(async () => {
  function connected(accounts) {
    L(accounts);
    const ready = accounts.length > 0;
    $('#connect').prop('disabled', ready);
    $('#connect').text(ready ? accounts[0] : 'Connect Wallet');
    $('#solution').prop('disabled', !ready);
    $('#solve').prop('disabled', !ready);
  }

  const wallet = new Wallet({ onAccountsChanged: connected });

  async function solve() {
    const solution = $('#solution').val();
    try {
      const result = await wallet.testSolution(solution);
      if (result) {
        await wallet.solve(solution);
      } else {
        $('#error').text('Sorry, try again!');
      }
    } catch (e) {
      L('E:', e.stack);
    }
  }

  async function connect() {
    $('#error').text('');
    try {
      await wallet.connect();
    } catch (e) {
      L(e);
      $('#error').text('Dangit! You need an Ethereum wallet such as Metamask to continue. :-(');
    }
  }

  connect();

  $('#connect').click(() => {
    connect();
  });

  $('#solve').click(solve);
  $('#solution').focus();
  $('#solution').keypress(() => {
    $('#error').text('');
  });
  onEnterPressed('#solution', solve);
});
