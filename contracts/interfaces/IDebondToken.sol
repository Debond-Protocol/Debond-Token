pragma solidity ^0.8.9;

// SPDX-License-Identifier: apache 2.0
/*
    Copyright 2022 Debond Protocol <info@debond.org>
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
    function totalSupply() external view returns (uint256);

    function getTotalCollateralisedSupply() external view returns (uint256);

    function getTotalAirdropSupply() external view returns (uint256);

    function getMaxAirdropSupply() external view returns (uint256);

    function getTotalAllocatedSupply() external view returns (uint256);

    function getMaxAllocatedPercentage() external view returns (uint256);

    function getTotalBalance(address _of) external view returns (uint256);

    function getLockedBalance(address account)
        external
        view
        returns (uint256 _lockedBalance);

    function transfer(address _to, uint256 _amount) external returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);

    function mintAirdropSupply(address _to, uint256 _amount) external;

    function mintCollateralisedSupply(address _to, uint256 _amount) external;

    function mintAllocatedSupply(address _to, uint256 _amount) external;

    function getCollateralisedBalance(address _of)
        external
        view
        returns (uint256);

    function getAllocatedBalance(address _of) external view returns (uint256);

    function getAirdropBalance(address _of) external view returns (uint256);

    function setMaxAirdropSupply(uint256 new_supply) external returns (bool);

    function setMaxAllocationPercentage(uint256 newPercentage)
        external
        returns (bool);

    function setBankAddress(address _bankAddress) external;

    function setAirdropAddress(address _airdropAddress) external;
    
    function setExchangeAddress(address _exchangeAddress) external;
    
}
