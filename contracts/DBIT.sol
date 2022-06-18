pragma solidity ^0.8.0;

// SPDX-License-Identifier: apache 2.0
/*
    Copyright 2021 Debond Protocol <info@debond.org>
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

import "./DebondToken.sol";
import "./interfaces/IDBIT.sol";

contract DBIT is IDBIT, DebondToken {

    constructor(
        string memory name,
        string memory symbol,
        address airdropAddress,
        address bankAddress,
        address governanceAddress,
        uint256 maxAirdropSupply,
        uint256 maxAllocpercentage
    ) DebondToken(name, symbol, airdropAddress, bankAddress, governanceAddress, maxAirdropSupply, maxAllocpercentage) {}

    function mintCollateralisedSupply(address _to, uint256 _amount) external {
        require(msg.sender == bankAddress);
        _mintCollateralisedSupply(_to, _amount);
    }

    function mintAllocatedSupply(address _to, uint256 _amount) external {
        require(msg.sender == airdropAddress);
        _mintAllocatedSupply(_to, _amount);
    }

    function getMaxAllocatedPercentage() external view returns (uint256) {
        return _maxAllocationPercentage;
    }

    function totalSupply() public view override(DebondToken, IDebondToken) returns (uint256)
    {
        return super.totalSupply();
    }

    function transfer(address _to, uint256 _amount) public override(DebondToken, IDebondToken) returns (bool)
    {
        return super.transfer(_to, _amount);
    }


}
