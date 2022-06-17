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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IDBIT.sol";
import "debond-governance/contracts/utils/GovernanceOwnable.sol";

contract DBIT is ERC20, IDBIT, GovernanceOwnable {
    //uint256 internal _maximumSupply;
    uint256 internal _maxAirdropSupply;
    uint256 internal _maxAllocationPercentage;

    uint256 internal _collateralisedSupply; // this will be  called by bank contract
    uint256 internal _allocatedSupply;
    uint256 internal _airdropSupply;

    mapping(address => uint256) public _airdropBalance;
    mapping(address => uint256) public _allocatedBalance;
    mapping(address => uint256) public _collateralisedBalance;

    constructor(
        address governanceAddress,
        uint256 maxAirdropSupply,
        uint256 maxAllocpercentage
    ) ERC20("DBIT", "DBIT token") GovernanceOwnable(governanceAddress) {
        //_maximumSupply = maxSupply;
        _maxAirdropSupply = maxAirdropSupply;
        _maxAllocationPercentage = maxAllocpercentage; // out of 10k.

        _collateralisedSupply = 0;
        _allocatedSupply = 0;
        _airdropSupply = 0;
    }

    function totalSupply()
        public
        view
        override(ERC20, IDBIT)
        returns (uint256)
    {
        return _collateralisedSupply + _allocatedSupply + _airdropSupply;
    }

    /*
    function getMaxSupply() external view returns (uint256) {
        return _maximumSupply;
    }
*/
    function getTotalCollateralisedSupply() external view returns (uint256) {
        return _collateralisedSupply;
    }

    /*
    function getMaxCollateralisedSupply() external view returns (uint256) {
        return (_maximumSupply -
            (_maxAirdropSupply +
                ((_maximumSupply * _maxAllocationPercentage) / 10000)));
    }
*/
    function getTotalAirdropSupply() public view returns (uint256) {
        return _airdropSupply;
    }

    function getMaxAirdropSupply() public view returns (uint256) {
        return _maxAirdropSupply;
    }

    function getTotalAllocatedSupply() public view returns (uint256) {
        return _allocatedSupply;
    }

    function getMaxAllocatedPercentage() public view returns (uint256) {
        return _maxAllocationPercentage;
    }

    function getTotalBalance(address _of) external view returns (uint256) {
        return (_airdropBalance[_of] +
            _allocatedBalance[_of] +
            _collateralisedBalance[_of]);
    }

        // NEW VERSION
    function getLockedBalance(address account)
        public
        view
        returns (uint256 _lockedBalance)
    {
        uint256 _maxUnlockable = 5 * _collateralisedSupply;
        uint256 _currentAirdropSupply = _airdropSupply * 100;

        _lockedBalance =
                (1 - (_maxUnlockable / _currentAirdropSupply)) * _airdropBalance[account];

        if (_currentAirdropSupply <= _maxUnlockable) {
            _lockedBalance = 0;
        }
    }


    // Check if supply is locked function, this will be called by the transfer  function
    function _checkIfLockedPart(address account, uint256 amountTransfer)
        internal
        view
        returns (bool)
    {
        return
            (balanceOf(account) - getLockedBalance(account)) >= amountTransfer;
    }

    function transfer(address _to, uint256 _amount)
        public
        override(ERC20, IDBIT)
        returns (bool)
    {
        require(_checkIfLockedPart(msg.sender, _amount), "insufficient supply");
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    // We need a transfer and transfer from function to replace the standarded ERC 20 functions.
    // In our functions we will be verifying if the transfered ammount <= balance - locked supply

    //direct transfer can only be called by bank contract or exchange contract, direct transfer don't need the approval of the sender.
    function directTransfer(address _to, uint256 _amount)
        public
        returns (bool)
    {
        require(
            msg.sender == _exchangeAddress || msg.sender == _bankAddress,
            "not available"
        );
        require(
            _checkIfLockedPart(msg.sender, _amount) == true,
            "insufficient supply"
        );
        transfer(_to, _amount);
        return (true);
    }

    // Must be sent from the airdrop contract address which is defined in the constructor
    function mintAirdropSupply(address _to, uint256 _amount) external {
        require(msg.sender == _airdropAddress, "denied");
        require(
            _airdropSupply + _amount <= _maxAirdropSupply,
            "exceeds the airdrop limit"
        );

        _airdropSupply += _amount;
        _airdropBalance[_to] += _amount;
        _mint(_to, _amount);

        // as the airdroped supply is minted it will be seperate from the each investors lockedBalance.
    }

    /** 
    minting supply during the bonds issuance.
     */
    function mintCollateralisedSupply(address _to, uint256 _amount) external {
        require(msg.sender == _bankAddress);
        /*       
        require(
            _amount <=
                _maximumSupply -
                    (_maxAirdropSupply +
                        ((_maximumSupply * _maxAllocationPercentage) / 10000) +
                        _collateralisedSupply),
            "exceeds limit"
        );
*/
        _collateralisedSupply += _amount;
        _collateralisedBalance[_to] += _amount;

        _mint(_to, _amount);
    }

    function mintAllocatedSupply(address _to, uint256 _amount) external {
        require(msg.sender == _airdropAddress);
        /*        
        require(
            _amount <
                (_maximumSupply * _maxAllocationPercentage) /
                    10000 -
                    _allocatedSupply,
            "limit exceeds"
        );
*/
        _allocatedSupply += _amount;
        _allocatedBalance[_to] += _amount;
        _mint(_to, _amount);
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

    /*
    function setMaxSupply(uint256 max_supply) public returns (bool) {
        require(msg.sender == _debondOperator, "denied:setMaxSupply");
        _maximumSupply = max_supply;
        return true;
    }
*/
    function setMaxAirdropSupply(uint256 new_supply) public returns (bool) {
        require(msg.sender == _debondOperator, "denied:setAirdropSupply");
        _maxAirdropSupply = new_supply;
        return true;
    }

    function setMaxAllocationPercentage(uint256 newPercentage)
        public
        returns (bool)
    {
        require(
            msg.sender == _debondOperator,
            "denied access:allocationPercentage"
        );
        _maxAllocationPercentage = newPercentage;
        return true;
    }
}
