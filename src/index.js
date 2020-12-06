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
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }

  $('#solution').focus();
});
