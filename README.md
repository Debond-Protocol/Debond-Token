# Debond-Token

- this repo consist of the contracts  for  DBIT and dGOV tokens and the airdrop .

## deploying details

- DBIT and dGOV  contract needs address of the deployed governance  address (by running the migration scripts from `Debond-Governance`), and needs to link with the minter roles for the bank , exchange and other contracts ( the scripts in migration does exactly that ).
- for airdrop contract , first define the json list of the address with their allocation  and computing their signatures to compare with the user who claims on the application . check [this](https://medium.com/@ItsCuzzo/using-signatures-ecdsa-for-nft-whitelists-ba0a4d070e92) article  for reference. 
