pragma solidity >=0.5.22 <0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Clue is ERC20 {
    string public _clue;

    // Maybe merge these to to save contract storage space
    bytes32 private _answerHash;
    bool private _answered;

    address owner;

    constructor() ERC20("CLUE", "FLAG") {
      _setupDecimals(2);
      _mint(msg.sender, 1000000000000);
      owner = msg.sender;
    }

    function resetClue(string memory newClue, bytes32 answerHash) public {
        require(msg.sender == owner);

        _clue = newClue;
        _answerHash = answerHash;
        _answered = false;
    }

    function solve(string memory answer) public returns (bool) {
        require(!_answered, "This clue is already cracked");

        // Note that keccak256 is the same as web3.utils.sha3 (but not official SHA3)
        if (keccak256(abi.encodePacked(answer)) == _answerHash) {
          _answered = true;
          _transfer(owner, msg.sender, 100);
          return true;
        }

        return false;
    }
}
