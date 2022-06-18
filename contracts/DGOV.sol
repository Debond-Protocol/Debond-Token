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
import "./interfaces/IDGOV.sol";

contract DGOV is IDGOV, DebondToken {
    uint256 internal _maximumSupply;

    constructor(
        string memory name,
        string memory symbol,
        address airdropAddress,
        address bankAddress,
        address governanceAddress,
        uint256 maxSupply,
        uint256 maxAirdropSupply,
        uint256 maxAllocpercentage
    ) DebondToken(name, symbol, airdropAddress, bankAddress, governanceAddress, maxAirdropSupply, maxAllocpercentage) {
        _maximumSupply = maxSupply;
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

    function setMaxSupply(uint256 max_supply) external onlyGovernance returns (bool) {
        _maximumSupply = max_supply;
        return true;
    }

    function mintAllocatedSupply(address _to, uint256 _amount) external {
        require(msg.sender == airdropAddress);
        require(
            _amount <
            (_maximumSupply * _maxAllocationPercentage) /
            10000 -
            _allocatedSupply,
            "limit exceeds"
        );
        _mintAllocatedSupply(_to, _amount);
    }

    function mintCollateralisedSupply(address _to, uint256 _amount) external {
        require(msg.sender == bankAddress);
        require(
            _amount <=
            _maximumSupply -
            (_maxAirdropSupply +
            ((_maximumSupply * _maxAllocationPercentage) / 10000) +
            _collateralisedSupply),
            "exceeds limit"
        );

        _mintCollateralisedSupply(_to, _amount);
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
