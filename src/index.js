import './style.css';
import 'animate.css';
import Web3 from 'web3';

function L(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

$(document).ready(() => {
  L('float64: hello world!');

  if (window.ethereum) {
    L('starting ethereum..');
    $('#connect').prop('disabled', false);
  }

  $('#solution').focus();
  $('#connect').click(async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    L(accounts);
    $('#connect').prop('disabled', true);
    $('#connect').text(accounts[0]);
  });
});
