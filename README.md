# CLUE

Clue is an Ethereum-based CTF game. **Work in progress**

## Quickstart

```
npm start
```

## Setup

Create a `.env` file and add:

```
WALLET_WORDS=abc def ghi...
ETH_NODE_URL=path to your ethereum node
```

To test:

```sh
$ truffle develop
truffle> test
```

To deploy:

```sh
$ truffle migrate --network goerli (--reset)
```

## Interacting with the contract on goerli

### Get the deployed instance

```
$ truffle console --network goerli
> migrate (--reset)
> clue = await Clue.deployed()
```

### Instantiate an existing contract

```
$ truffle console --network goerli
> clue = await Clue.at('0x...contract address')
```

### Setup and test clues

```sh
# Setup a flag with the SHA3 hash of the solution
> await clue.resetClue("What's the story, morning glory?", web3.utils.sha3("ain't no slug, jitterbug"))

# Call solve and get return value without modifying chain state:
> await clue.solve.call(web3.utils.stringToHex("ain't no slug, jitterbug"))

# Call solve for real (modify chain state), get tx hash (but not return value):
> accounts = await web3.eth.getAccounts()
> await clue.solve(web3.utils.stringToHex("ain't no slug, jitterbug"), {from: accounts[1]})

# Account balance of caller should now be 1:
> await clue.balanceOf.call(accounts[1])
```
