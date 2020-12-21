import './style.css';
import 'animate.css';
import Wallet from './wallet.ts';
import Clue from './clue.ts';
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
    $('#commit').prop('disabled', !ready);
    $('#solution').focus();
  }

  function disable() {
    $('#solution').prop('disabled', true);
    $('#commit').prop('disabled', true);
    $('#solve').prop('disabled', true);
  }

  const wallet = new Wallet({ onAccountsChanged: connected });
  const clue = new Clue(wallet);

  async function commit() {
    const solution = $('#solution').val();
    try {
      const result = await clue.testSolution(solution);
      if (result) {
        L('commiting solution...');
        await clue.commit(solution);
        $('#solve').prop('disabled', false);
      } else {
        $('#error').text('Wrong answer, try again!');
        $('#solution').focus();
      }
    } catch (e) {
      $('#error').text('Something went wrong!');
      L('E:', e.stack);
    }
  }

  async function solve() {
    const solution = $('#solution').val();
    try {
      const result = await clue.testSolution(solution);
      if (result) {
        L('sending solution...');
        await clue.solve(solution);
        disable();
        $('#error').text('You cracked it! FLAG claimed!');
      } else {
        $('#error').text('Wrong answer, try again!');
        $('#solution').focus();
      }
    } catch (e) {
      $('#error').text('Something went wrong!');
      L('E:', e.stack);
    }
  }

  async function connect() {
    $('#error').text('');
    try {
      await wallet.connect();
      const clueText = await clue.getClue();
      $('#clue').text(clueText);
      if (clue.solved) {
        disable();
        $('#solution').val('This clue is already solved.');
      }
    } catch (e) {
      L(e);
      $('#error').text('Dangit! You need an Ethereum wallet such as Metamask to continue. :-(');
    }
  }

  connect();

  $('#connect').click(() => {
    connect();
  });

  $('#commit').click(commit);
  $('#solve').click(solve);
  $('#solution').focus();
  $('#solution').keypress(() => {
    $('#error').text('');
    setTimeout(() => {
      if (clue.commitment == clue.makeCommitment($('#solution').val())) {
        $('#solve').prop('disabled', false);
      } else {
        $('#solve').prop('disabled', true);
      }
    }, 0);
  });
  onEnterPressed('#solution', solve);
});
