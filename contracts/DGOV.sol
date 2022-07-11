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
import "./interfaces/IDGOV.sol";

contract DGOV is IDGOV, DebondToken {
    uint256 internal _maximumSupply;

    constructor(
        address governanceAddress,
        address bankAddress,
        address airdropAddress,
        address _exchangeAddress
    )
        DebondToken(
            "DGOV",
            "DGOV",
            airdropAddress,
            bankAddress,
            governanceAddress,
            _exchangeAddress,
            250_000 ether,
            1000 // rate on 10000 (10%)
        )
    {
        _maximumSupply = 1_000_000 ether;
    }

    function getMaxSupply() external view returns (uint256) {
        return _maximumSupply;
    }

    function getMaxAllocatedSupply() public view returns (uint256) {
        return (_maximumSupply * _maxAllocationPercentage) / 10000;
    }

    function getMaxCollateralisedSupply() external view returns (uint256) {
        return (_maximumSupply -
            (_maxAirdropSupply +
                ((_maximumSupply * _maxAllocationPercentage) / 10000)));
    }

    function setMaxSupply(uint256 max_supply)
        external
        onlyGovernance
        returns (bool)
    {
        require(
            max_supply >
                _maxAirdropSupply + _allocatedSupply + _collateralisedSupply,
            "Max Supply cannot be less than max estimated supply"
        );
        _maximumSupply = max_supply;
        return true;
    }

    function mintAllocatedSupply(address _to, uint256 _amount)
        external
        onlyGovernance
    {
        require(
            _amount <= getMaxAllocatedSupply() - _allocatedSupply,
            "limit exceeds"
        );
        _mintAllocatedSupply(_to, _amount);
    }

    function mintCollateralisedSupply(address _to, uint256 _amount)
        external
        onlyBank
    {
        require(
            _amount <=
                _maximumSupply -
                    (_maxAirdropSupply +
                        getMaxAllocatedSupply() +
                        _collateralisedSupply),
            "exceeds limit"
        );

        _mintCollateralisedSupply(_to, _amount);
    }

    function totalSupply()
        public
        view
        override(DebondToken, IDebondToken)
        returns (uint256)
    {
        return super.totalSupply();
    }

    function transfer(address _to, uint256 _amount)
        public
        override(DebondToken, IDebondToken)
        returns (bool)
    {
        return super.transfer(_to, _amount);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override(DebondToken, IDebondToken) returns (bool) {
        return super.transferFrom(_from, _to, _amount);
    }
}
