pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: apache 2.0
/*
    Copyright 2020 Sigmoid Foundation <info@SGM.finance>
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

interface IDebondToken {
   
    /** returns  the collateralised balance of DBIT token 
        @param   _from  is the  address  of the entity (or smart contract) that you want to determine balance.
     */

    function collateralisedSupplyBalance(address _from) external returns (uint256);
   
    /** returns  the airdroped  supply (currently received by given address) of DBIT token 
        @param   _from  is the  address  of the entity (or smart contract) that you want to determine balance.
     */
    function airdroppedSupplyBalance(address _from) external returns (uint256);
   
     /** returns  the allocated  supply (set  by governance ) that  can be claimed  of DBIT token .
        @param   _from  is the  address  of the entity (or smart contract) that you want to determine balance.
     */


    function allocatedSupplyBalance(address _from) external returns (uint256);

   
    /** 
    returns the total supply  of tokens in circulation.
    */
    function totalSupply() external view returns (uint256);

    /** gets the total supply of allocation of DBIT by governance by every user
     */

    function allocatedSupply() external view returns (uint256);
    /** gets the total supply of airdroped tokens of DBIT by governance by every user */

    function airdropedSupply() external view returns (uint256);
    

   /** determines the lockedBalance (supply of tokens  that are  staked in bank but cant be recovered) for the given token   
    @notice will be returning 0 for the initial amount of supply
    @param account address of account you want to determine the supply.
    */

    function LockedBalance(address account) external view returns (uint256 _lockedBalance);


    /**trasnfer function for sending DBIT tokens from bankAddress / exchangeAddress to the accounts (for paying the interest / auction price and redemption).  
    _from is the address of bank or exchange Address  
    _to is the destination address  of the user receiving DBIT tokens 
    _amount is the amount that you want to transfer.
    @notice  here governance / exchange needs to be approved only to transfer the given amount .
    
    */    
    function directTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);


    /** 
    mints the collateralised DBIT  tokens  (by bank ) and transfers to the user issuing bonds.  
    _to is the destination address of the useraddress
    */


    function mintCollateralisedSupply(address _to, uint256 _amount) external;


    /** mints the allocated  DBIT  tokens  ( supply is defined and transferred by governance) and transfers to the user issuing bonds.  
    _to is the destination address of the useraddress.
    _amount is the amount to be minted.
    
    */


    function mintAllocatedSupply(address _to, uint256 _amount) external;

    /** 
    minting airdropped supply

    */


    function mintAirdroppedSupply(address _to, uint256 _amount) external;



    /**
    allows setting of the Airdropped supply
     */

    function setAirdroppedSupply(uint256 new_supply) external returns (bool);

   
}
