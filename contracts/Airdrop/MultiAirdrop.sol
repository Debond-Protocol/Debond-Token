pragma solidity ^0.8.9;
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
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./interfaces/IMultiAirdrop.sol";
import "./interfaces/IAirdropToken.sol";

contract MultiAirdrop is IMultiAirdrop, Ownable {
    // Based on the Uniswap Airdrop

    bytes32 private _merkleRoot;
    // defining address  airdrop supply for the given tokens 
    AirdropToken[] private _tokens;

    // This is a packed array of booleans.
    mapping(uint256 => uint256) private _claimedBitMap;

    constructor() Ownable() {}

    function setAirDrop(bytes32 root, AirdropToken[] memory tokens_)
        external override onlyOwner
        returns (bool)
    {
        _merkleRoot = root;
        delete _tokens;
        for (uint256 i = 0; i < tokens_.length; i++) {
            _tokens.push(tokens_[i]);
            IAirdropToken(tokens_[i].token).setAirdropedSupply(
                tokens_[i].airdropped
            );
        }  
        return true;
    }

    function setAirDrop_ (bytes32 root, AirdropToken[] memory tokens_)
       public 
        returns (bool)
    {
        return this.setAirDrop(root, tokens_);
    }

    function totalAirdrop(address token)
        external view override 
        returns (uint256)
    {
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_tokens[i].token == token) {
                return _tokens[i].airdropped;
            }
        }
        return 0;
    }

    function merkleRoot() external view returns (bytes32) {
        return _merkleRoot;
    }

    function tokens() external view returns (AirdropToken[] memory) {
        return _tokens;
    }

    function isClaimed(uint256 index) external override view returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = _claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        _claimedBitMap[claimedWordIndex] =
            _claimedBitMap[claimedWordIndex] |
            (1 << claimedBitIndex);
    }

    function setMerkleRoot(bytes32 root) external override onlyOwner returns (bool) {
        _merkleRoot = root;
        return true;
    }

    function _claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] memory merkleProof
    ) private {
        require(!this.isClaimed(index), "MultiAirdrop: Drop already claimed.");
        require(amount > 0, "MultiAirdrop: Zero amount.");
        require(account != address(0x0),"MultiAirdrop: Empty account.");
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        require(
            MerkleProof.verify(merkleProof, _merkleRoot, node),
            "MultiAirdrop: Invalid proof."
        );
        // Mark it claimed and send the tokens.
       _setClaimed(index);
         for (uint i=0; i<_tokens.length; i++) {
            IAirdropToken(_tokens[i].token).mintAirdrop(account, amount);
        }
          emit Claimed(index, account, amount); 
    }

    function claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] memory merkleProof
    ) external virtual override {
        _claim(index, account, amount, merkleProof);
    }

    function claim_(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] memory merkleProof
    ) public {
        _claim(index, account, amount, merkleProof);
    }
}