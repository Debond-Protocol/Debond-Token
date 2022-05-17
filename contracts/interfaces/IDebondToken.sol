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

interface IDebondToken  {
    function mintCollateralisedSupply(address _to, uint256 _amount) external ;

    function mintAllocatedSupply(address _to, uint256 _amount) external  ; 

    function mintAirdroppedSupply(address _to, uint256 _amount) external;
        
    function setGovernanceContract(address governance_address)
        external
        returns (bool);
    function setBankContract(address bank_addres)
        external    
        returns (bool);
    function supplyCollateralised() external returns(uint256);

    function directTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external  returns (bool);
   // function lockedBalance(address account) external view returns (uint256);
 }
