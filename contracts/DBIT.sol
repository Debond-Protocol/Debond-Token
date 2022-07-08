pragma solidity ^0.8.0;

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

import "./DebondToken.sol";

contract DBIT is DebondToken {
    constructor(
        address governanceAddress,
        address bankAddress,
        address airdropAddress,
        address exchangeAddress
    )
        DebondToken(
            "DBIT",
            "DBIT",
            airdropAddress,
            bankAddress,
            governanceAddress,
            exchangeAddress,
            500_000 ether,
            1000 // rate on 10000 (10%)
        )
    {}

    function mintCollateralisedSupply(address _to, uint256 _amount)
        external
        onlyBank
    {
        _mintCollateralisedSupply(_to, _amount);
    }

    function mintAllocatedSupply(address _to, uint256 _amount)
        external
        onlyGovernance
    {
        require(
            _amount <
                (totalSupply() * _maxAllocationPercentage) /
                    10000 -
                    _allocatedSupply,
            "limit exceeds"
        );
        _mintAllocatedSupply(_to, _amount);
    }

    function totalSupply() public view override(DebondToken) returns (uint256) {
        return super.totalSupply();
    }

    function transfer(address _to, uint256 _amount)
        public
        override(DebondToken)
        returns (bool)
    {
        return super.transfer(_to, _amount);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override(DebondToken) returns (bool) {
        return super.transferFrom(_from, _to, _amount);
    }
}
