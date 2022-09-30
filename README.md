# Debond-Token

This repo consist of the ERC20 contracts  which are minted when the bond is redeemed by the user. it consist of following contracts: 

- DebondToken is the common functions used by both tokens to mint the different supplies and determine the locked balance.

- DGOV contract  is inheritance of DebondToken contract with sole condition of having an hardcap supply of tokens and conditions related to the allocatedSupply and collateralisedSupply.

- DBIT similarly is inheritance of the DebondToken with no supply cap and condition of locked supply and allocatedSupply.

# Structure: 

Debond tokens (both the core utility token and governance token) defines following type of bond supply: 
    1. `lockedSupply`: Reserve of tokens that are already being the utilised for the bonds . and thus this supply cannot be reutilized for other uncase (secondary market and governance).
        1. it should be <= 5% of the collateralized supply in order to transfer the tokens between the counterparties.
 

    2. the unlocked supply is further divided into 3 parts : 
        1. `AirdroppedSupply`supply for the claimable airdrop tokens  only by airdrop contract, it is considered in the contract supply  
        1. `allocatedSupply` (that is supplied by the governance contract to the core community member) 
        1.  `collateralised` supply (that is minted by the bank and added to the APm during the bond issuance).

## deploying details

```bash
> npm i

> truffle compile 

> npm run generate-types

## running both commands in parallel terminal.

> truffle test  
> npx ganache -p 7545

```

### interfaces 



## Security Considerations:

1. Insure the initialization of bank and exchange contracts correctly ans then whey will be have access to all of the contract.

2. In order to get correct unlocked Supply, there airdrop supply needs to be already minted as in the `getLockedSupply()`  there will be div by 0 incident. so we need to set an default supply.
