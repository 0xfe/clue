pragma solidity >=0.5.22 <0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Clue is ERC20 {
    string private _clue;
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

    function clue() public view returns (string memory) {
        return _clue;
    }

    /*
      Note that keccak256 is the same as web3.utils.sha3 (but not official SHA3)

      Setup a clue:
      > await clue.resetClue("your mom", web3.utils.sha3(web3.utils.stringToHex("bbb")))

      Call solve and get return value without modifying chain state:
      > await clue.solve.call(web3.utils.stringToHex("bbb"))

      Call solve for real (modify chain state), get tx hash (but not return value):

      > accounts = await web3.eth.getAccounts()
      > await clue.solve(web3.utils.stringToHex("bbb"), {from: accounts[1]})

      Account balance of caller should now be 1:
      > await clue.balanceOf(accounts[1])
    */

    function solve(string memory answer) public returns (bool) {
        require(!_answered, "This clue is already cracked");

        if (keccak256(abi.encodePacked(answer)) == _answerHash) {
          _answered = true;
          _transfer(owner, msg.sender, 100);
          return true;
        }

        return false;
    }
}
