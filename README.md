# Debond-Token

This repo consist of the ERC20 contracts  which are minted when the bond is redeemed by the user. it consist of following contracts: 

- DebondToken is the common implementation of all the minting and getter contracts needed by both DBIT/DGOV ones.
- DGOV contracts essentially is inheritance of DebondToken contract with sole condition of having an hardcap supply of tokens.
- DBIT similarly is inheritance of the DebondToken with no supply cap.

## deploying details

```bash
> npm i

> truffle compile 


> npm run generate-types

## running both commands in parallel terminal.

> truffle test  
> npx ganache -p 7545

```

## Miscellaneous: 

- the contract inheritance  diagram & details of contracts are available in the docs/ folder.
