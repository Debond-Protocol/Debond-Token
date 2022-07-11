# Debond-Token

This repo consist of the ERC20 contracts  which are minted when the bond is redeemed by the user. it consist of following contracts: 

- DebondToken is the common implementation of all the minting and getter contracts needed by both DBIT/DGOV ones.
- DGOV contracts essentially is inheritance of DebondToken contract with sole condition of having an hardcap supply of tokens.
- DBIT similarly is inheritance of the DebondToken with no supply cap.


# Structure: 

Debond tokens (both the core utility token and governance token) defines following type of bond supply: 
    1. The locked supply: Reserve of tokens that are already being the utilised for the bonds . and thus this supply cannot be reutilized for other uncase (secondary market and governance).
    2. the unlocked supply is further divided into 3 parts : Airdroped supply(for the claimable airdrop tokens in the given token contract), allocatedTokn(that is supplied by the governance contract to the core community member) and collateralised supply (that is minted by the bank and added to the APm during the bond issuance).




## deploying details

```bash
> npm i

> truffle compile 


> npm run generate-types

## running both commands in parallel terminal.

> truffle test  
> npx ganache -p 7545

```

## Security Considerations:

1. Insure the initialization of bank and exchange contracts correctly ans then whey will be have access to all of the contract.

2. In order to get correct unlocked Supply, there airdrop supply needs to be already minted as in the `getLockedSupply()`  there will be div by 0 incident. so we need to set an default supply.