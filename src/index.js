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
    $('#connect').prop('disabled', true);
    $('#connect').text(accounts[0]);
  }

  const wallet = new Wallet({ onAccountsChanged: connected });

  async function solve() {
    const solution = $('#solution').val();
    try {
      const result = await wallet.testSolution(solution);
      if (result) {
        await wallet.solve(solution);
      }
    } catch (e) {
      L('E:', e.stack);
    }
  }

  await wallet.connect();

  $('#connect').click(() => {
    wallet.connect();
  });

  $('#solve').click(solve);
  $('#solution').focus();
  onEnterPressed('#solution', solve);
});
