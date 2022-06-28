## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/DBIT.sol | 5b2698a01e3dd2e9f4fca2e18a0835c41980a373 |
| contracts/DGOV.sol | f77e7d09892138bebd6bbbc683922f6b5e5fa950 |
| contracts/DebondToken.sol | f69a4e2590af06e0c56f7e3fb4fb4c952e214bf8 |
| contracts/Migrations.sol | 69b8fd36420e55cf1274bec2e70399dddcd700fc |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **DBIT** | Implementation | IDBIT, DebondToken |||
| └ | <Constructor> | Public ❗️ | 🛑  | DebondToken |
| └ | mintCollateralisedSupply | External ❗️ | 🛑  | onlyBank |
| └ | mintAllocatedSupply | External ❗️ | 🛑  | onlyGovernance |
| └ | getMaxAllocatedPercentage | External ❗️ |   |NO❗️ |
| └ | totalSupply | Public ❗️ |   |NO❗️ |
| └ | transfer | Public ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | Public ❗️ | 🛑  |NO❗️ |
||||||
| **DGOV** | Implementation | IDGOV, DebondToken |||
| └ | <Constructor> | Public ❗️ | 🛑  | DebondToken |
| └ | getMaxSupply | External ❗️ |   |NO❗️ |
| └ | getMaxAllocatedSupply | Public ❗️ |   |NO❗️ |
| └ | getMaxCollateralisedSupply | External ❗️ |   |NO❗️ |
| └ | setMaxSupply | External ❗️ | 🛑  | onlyGovernance |
| └ | mintAllocatedSupply | External ❗️ | 🛑  | onlyGovernance |
| └ | mintCollateralisedSupply | External ❗️ | 🛑  | onlyBank |
| └ | totalSupply | Public ❗️ |   |NO❗️ |
| └ | transfer | Public ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | Public ❗️ | 🛑  |NO❗️ |
||||||
| **DebondToken** | Implementation | IDebondToken, ERC20, GovernanceOwnable |||
| └ | <Constructor> | Public ❗️ | 🛑  | ERC20 GovernanceOwnable |
| └ | totalSupply | Public ❗️ |   |NO❗️ |
| └ | getTotalCollateralisedSupply | External ❗️ |   |NO❗️ |
| └ | getTotalAirdropSupply | Public ❗️ |   |NO❗️ |
| └ | getMaxAirdropSupply | Public ❗️ |   |NO❗️ |
| └ | getTotalAllocatedSupply | Public ❗️ |   |NO❗️ |
| └ | getTotalBalance | External ❗️ |   |NO❗️ |
| └ | getLockedBalance | Public ❗️ |   |NO❗️ |
| └ | _checkIfUnlockedPart | Internal 🔒 |   | |
| └ | transfer | Public ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | Public ❗️ | 🛑  |NO❗️ |
| └ | directTransfer | Public ❗️ | 🛑  |NO❗️ |
| └ | mintAirdropSupply | External ❗️ | 🛑  | onlyAirdrop |
| └ | getCollateralisedBalance | External ❗️ |   |NO❗️ |
| └ | getAllocatedBalance | External ❗️ |   |NO❗️ |
| └ | getAirdropBalance | External ❗️ |   |NO❗️ |
| └ | setMaxAirdropSupply | External ❗️ | 🛑  | onlyGovernance |
| └ | setMaxAllocationPercentage | External ❗️ | 🛑  | onlyGovernance |
| └ | _mintAllocatedSupply | Internal 🔒 | 🛑  | |
| └ | _mintCollateralisedSupply | Internal 🔒 | 🛑  | |
| └ | setBankAddress | External ❗️ | 🛑  | onlyGovernance |
| └ | setAirdropAddress | External ❗️ | 🛑  | onlyGovernance |
| └ | setExchangeAddress | External ❗️ | 🛑  | onlyGovernance |
||||||
| **Migrations** | Implementation |  |||
| └ | setCompleted | Public ❗️ | 🛑  | restricted |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
