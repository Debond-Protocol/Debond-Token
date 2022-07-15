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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@debond-protocol/debond-governance-contracts/utils/GovernanceOwnable.sol";
import "./interfaces/IDebondToken.sol";

abstract contract DebondToken is IDebondToken, ERC20, GovernanceOwnable {
    address public airdropAddress;
    address public bankAddress;
    address public exchangeAddress;
    uint256 internal _maxAirdropSupply;
    uint256 internal _maxAllocationPercentage;
    uint256 internal _collateralisedSupply; // this will be  called by bank contract
    uint256 internal _allocatedSupply;
    uint256 internal _airdropSupply;

    mapping(address => uint256) public _airdropBalance;
    mapping(address => uint256) public _allocatedBalance;
    mapping(address => uint256) public _collateralisedBalance;

    constructor(
        string memory name,
        string memory symbol,
        address _airdropAddress,
        address _bankAddress,
        address governanceAddress,
        address _exchangeAddress,
        uint256 maxAirdropSupply,
        uint256 maxAllocpercentage
    ) ERC20(name, symbol) GovernanceOwnable(governanceAddress) {
        airdropAddress = _airdropAddress;
        bankAddress = _bankAddress;
        _maxAirdropSupply = maxAirdropSupply;
        _maxAllocationPercentage = maxAllocpercentage; // out of 10k.
        exchangeAddress = _exchangeAddress;
        _collateralisedSupply = 0;
        _allocatedSupply = 0;
        _airdropSupply = 0;
    }

    modifier onlyBank() {
        require(msg.sender == bankAddress, "DebondToken: only Bank Callable");
        _;
    }

    modifier onlyAirdrop() {
        require(
            msg.sender == airdropAddress,
            "DebondToken: only Airdrop Callable"
        );
        _;
    }

    function totalSupply()
        public
        view
        virtual
        override(ERC20, IDebondToken)
        returns (uint256)
    {
        return _collateralisedSupply + _allocatedSupply + _airdropSupply;
    }

    function getTotalCollateralisedSupply() external view returns (uint256) {
        return _collateralisedSupply;
    }

    function getTotalAirdropSupply() public view returns (uint256) {
        return _airdropSupply;
    }

    function getMaxAirdropSupply() public view returns (uint256) {
        return _maxAirdropSupply;
    }

    function getTotalAllocatedSupply() public view returns (uint256) {
        return _allocatedSupply;
    }

    function getMaxAllocatedPercentage() external view returns (uint256) {
        return _maxAllocationPercentage;
    }

    function getTotalBalance(address _of) external view returns (uint256) {
        return (_airdropBalance[_of] +
            _allocatedBalance[_of] +
            _collateralisedBalance[_of]);
    }

    function getLockedBalance(address account)
        public
        view
        returns (uint256 _lockedBalance)
    {
        // max 5% of collateralised supply can be transferred
        uint256 _maxUnlockable = _collateralisedSupply * 5;
        // multiplying by 100, since _maxUnlockable isn't divided by 100
        uint256 _currentAirdropSupply = _airdropSupply * 100;

        _lockedBalance = 0;
        if (_currentAirdropSupply > _maxUnlockable) {
            _lockedBalance =
                ((100 - (_maxUnlockable * 100) / _currentAirdropSupply) *
                    _airdropBalance[account]) /
                100;
        }
        return _lockedBalance;
    }

    // Check if supply is locked function, this will be called by the transfer  function
    function _checkIfUnlockedPart(address account, uint256 amountTransfer)
        internal
        view
        returns (bool)
    {
        return
            (balanceOf(account) - getLockedBalance(account)) >= amountTransfer;
    }

    function transfer(address _to, uint256 _amount)
        public
        virtual
        override(ERC20, IDebondToken)
        returns (bool)
    {
        require(
            _checkIfUnlockedPart(msg.sender, _amount),
            "insufficient supply"
        );
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public virtual override(ERC20, IDebondToken) returns (bool) {
        require(_checkIfUnlockedPart(_from, _amount), "insufficient supply");
        super.transferFrom(_from, _to, _amount);
        return true;
    }

    // Must be sent from the airdrop contract address which is defined in the constructor
    function mintAirdropSupply(address _to, uint256 _amount)
        external
        onlyAirdrop
    {
        require(
            _airdropSupply + _amount <= _maxAirdropSupply,
            "exceeds the airdrop limit"
        );

        _airdropSupply += _amount;
        _airdropBalance[_to] += _amount;
        _mint(_to, _amount);

        // as the airdroped supply is minted it will be seperate from the each investors lockedBalance.
    }

    function getCollateralisedBalance(address _of)
        external
        view
        returns (uint256)
    {
        return _collateralisedBalance[_of];
    }

    function getAllocatedBalance(address _of) external view returns (uint256) {
        return _allocatedBalance[_of];
    }

    function getAirdropBalance(address _of) external view returns (uint256) {
        return _airdropBalance[_of];
    }

    function setMaxAirdropSupply(uint256 new_supply)
        external
        onlyGovernance
        returns (bool)
    {
        require(
            new_supply >= _airdropSupply,
            "Airdrop: Max supply cannot be less than current supply"
        );
        _maxAirdropSupply = new_supply;
        return true;
    }

    function setMaxAllocationPercentage(uint256 newPercentage)
        external
        onlyGovernance
        returns (bool)
    {
        require(
            newPercentage < 10000,
            "Allocation: Percentage cannot go above 9999 Parts"
        );
        _maxAllocationPercentage = newPercentage;
        return true;
    }

    function _mintAllocatedSupply(address _to, uint256 _amount) internal {
        _allocatedSupply += _amount;
        _allocatedBalance[_to] += _amount;
        _mint(_to, _amount);
    }

    function _mintCollateralisedSupply(address _to, uint256 _amount) internal {
        _collateralisedSupply += _amount;
        _collateralisedBalance[_to] += _amount;
        _mint(_to, _amount);
    }

    function setBankAddress(address _bankAddress) external onlyGovernance {
        require(
            _bankAddress != address(0),
            "DebondToken Error: address 0 given"
        );
        bankAddress = _bankAddress;
    }

    function setAirdropAddress(address _airdropAddress)
        external
        onlyGovernance
    {
        require(
            _airdropAddress != address(0),
            "DebondToken Error: address 0 given"
        );
        airdropAddress = _airdropAddress;
    }

    function setExchangeAddress(address _exchangeAddress)
        external
        onlyGovernance
    {
        require(
            _exchangeAddress != address(0),
            "DebondToken Error: address 0 given"
        );
        exchangeAddress = _exchangeAddress;
    }
}
