# CLUE

Clue is an Ethereum-based CTF game. **Work in progress**

## Quickstart

#### Deploy contract

```
truffle develop
migrate --reset
```

#### Start CTF app

```
npm start
```

#### Setup Metamask

Create a new network in Metamask using Custom RPC, and select `http://localhost:9545` to connect with truffle. Then
(create and) copy the primary accounts address and send some ether to it:

```
truffle develop
> await web3.eth.sendTransaction({from: accounts[0], to: "0xB81909F3360e22067e4AA379C9FB5916154271a1", value: "1000000000000000000"})
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
> await clue.solve.call("ain't no slug, jitterbug")

# Call solve for real (modify chain state), get tx hash (but not return value):
> accounts = await web3.eth.getAccounts()
> await clue.solve("ain't no slug, jitterbug", {from: accounts[1]})

# Account balance of caller should now be 1:
> await clue.balanceOf.call(accounts[1])
```
