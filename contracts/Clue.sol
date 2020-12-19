pragma solidity >=0.5.22 <0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Clue is ERC20 {
    string public _clue;
    bool public _answered;

    // Maybe merge these to to save contract storage space
    bytes32 private _answerHash;

    address owner;

    // Commitments prevent front-runners from stealing submitted answers and
    // submitting it themselves.
    //
    // Before revealing the solution, users must send a commitment, which is
    // an HMAC of the solution, using their sender address as the key.
    mapping(address => bytes32) private _commitments;
    address[] private _commitmentKeys;

    constructor() ERC20("CLUE", "FLAG") {
      _setupDecimals(2);
      _mint(msg.sender, 1000000000000);
      owner = msg.sender;
    }

    function hmac(string memory solution, address addr) internal pure returns (bytes32) {
      // This is not a real HMAC, but sufficient for experiment.
      // In JS:
      //   web3.utils.keccak256(web3.utils.hexToBytes(ADDR).concat(web3.utils.hexToBytes(web3.utils.toHex(SOLUTION))))
      return keccak256(abi.encodePacked(addr, solution));
    }

    function resetClue(string memory newClue, bytes32 answerHash) public {
        require(msg.sender == owner);

        _clue = newClue;
        _answerHash = answerHash;
        _answered = false;

        // Clear all existing commitments, recover space. (Is this necessary?)
        for (uint i = 0; i < _commitmentKeys.length; i++) {
          delete _commitments[_commitmentKeys[i]];
        }

        delete _commitmentKeys;
    }

    function commit(bytes32 commitment) public {
      require(!_answered, "This clue is already cracked");
      _commitments[msg.sender] = commitment;
    }

    function solve(string memory answer) public returns (bool) {
        require(!_answered, "This clue is already cracked");
        require(_commitments[msg.sender] != 0, "No commitment available for this address");
        require(hmac(answer, msg.sender) == _commitments[msg.sender], "Solution does not match commitment");

        // Note that keccak256 is the same as web3.utils.keccak256(...)
        if (keccak256(abi.encodePacked(answer)) == _answerHash) {
          _answered = true;
          _transfer(owner, msg.sender, 100);
          return true;
        }

        return false;
    }
}
