pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAirdropToken.sol";
//import "./interfaces/IdGOV.sol";

// contract AirdropToken is IAirdropToken, Ownable {
//     uint256 public _airDropSupply;// to be taken from airdrop token
//     uint256 public _total_airdropped; // current supply that is unlocked and supplied
//     uint256 public _lockTime; // this is the timestamp after which the claim can be executed.

//     address dGOVAddress;
//     address minter_address; // here the minter is airdrop Contract.

    
//     mapping(address => uint256 ) _lockedSupply;


//     modifier onlyAfterTime() {
//         require(
//             _lockTime <= block.timestamp,
//             "AirdropToken: too early for claim"
//         );
//         _;
//     }

//     constructor(
//         address _dGOVAddress,
//         uint256 lockTime_,
//         address _minter_address
//     ) {
//         require(
//             dGOVAddress != address(0x0),
//             "cant define Address(0) as airdrop"
//         );
//         dGOVAddress = _dGOVAddress;
//         _lockTime = lockTime_;
//         minter_address = _minter_address; // setting first address(0) and then changing afterwards. 
//         _airDropSupply = IdGOV(dGOVAddress).AirdropedSupply();
    
//     }

    

//     function setLockTime(uint256 lockTime_) external {
//         require(
//             msg.sender == minter_address,
//             "AirdropToken: Not an airdrop contract"
//         );
//         _lockTime = lockTime_;
//     }

//     function getLockTime() external view returns(uint256) {
//         return _lockTime;
//     }

//     function mintAirdrop(address to, uint256 amount) external returns (bool) {
//         require(
//             msg.sender == minter_address,
//             "AirdropToken: Not an airdrop contract"
//         );

//         require(to != address(0), "AirdropToken: incorrect address ");

//         require(_airDropSupply >= amount, "AirdropToken: cant ask more than limit");



//         IdGOV(dGOVAddress).mintAirdropedSupply(to, amount);

//         _total_airdropped += amount;
//         _airDropSupply -= amount;
//         return true;
//     }


//     function setAirdropContractAddress(address newAddr) onlyOwner external returns(bool) {
//         minter_address = newAddr;
//         return true;
//     }


//     function setAirdropedSupply (uint256 total_airdroped_supply)
//         external  
//         onlyOwner
//         returns (bool)
//         {

//         IdGOV(dGOVAddress).setAirdroppedSupply(total_airdroped_supply);
//         return true;
//         }
//     function getLockedBalance(address account)
//         external
//         override
//         returns (uint256)
//     {
//         return (IdGOV(dGOVAddress).setLockedBalance(account));
//     }

    

//     function setdGOV(address _dGOVAddress) external onlyOwner returns (bool) {
//         require(msg.sender == minter_address, "only airdrop contract");
//         dGOVAddress = _dGOVAddress;
//         return (true);
//     }
// }

// testing previous version .

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMultiAirdrop.sol";
import "./interfaces/IAirdropToken.sol";

import "./interfaces/IdGOV.sol";

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
contract AirdropToken is IAirdropToken, ERC20, Ownable {
    address private _airDrop; // airdropContract address
    // stores the 
        struct AirdropToken {
        address payable token;
        uint256 airdropped;
    }
  
    uint private _total_airdropped; //total airdrop token minted 
    uint private _lockTime; // timestamp after which openlock can be tested.
    AirdropToken _token; // details about the dGOV token  (TODO: ask whether DBIT will also be there).
   

    // this will be defined from  dGOV tokens.
   // mapping(address => uint) private _lockedBalance;

    modifier onlyAirdropOrOwner{
        require(msg.sender == owner() || msg.sender == _airDrop, 'AirdropToken: Not an airdrop contract');
        _;
    }

    modifier onlyAfterTime {
        require(_lockTime <= block.timestamp, 'AirdropToken: too early for claim');
        _;
    }

    /**
    dropContract is the address of the airdropContract (having higher level funcs for setting address , locktime and Token).

     */

    constructor (address dropContract, uint lockTime_, address _tokenAddress)  Ownable() {
        require(dropContract != address(0x0), "AirdropToken: Airdrop contract should not to be 0x0");
        _airDrop = dropContract;
        _lockTime = lockTime_;
        _token.token = _tokenAddress;
        _token.airdropped = 0;
    }

    function isAirdrop() internal view returns (bool) {
         return msg.sender == _airDrop;
    }
// setting new  airdropContract
    function setAirdropContract(address dropContract) override external onlyOwner returns (bool) {
        require(dropContract != address(0x0), "AirdropToken: Airdrop contract should not to be 0x0");
        _airDrop = dropContract;
        return true;
    }
// get total airdrop supply .
    function getAirdropedSupply() external virtual view returns (uint) {
        return IdGOV(_token.token).AirdropedSupply();
    }
//  
    function getTotalAirdropSupply() external  view returns (uint) {
        return _total_airdropped;
    }
//
    function getAirdropContract() external virtual view returns (address) {
        return _airDrop;
    }
// TODO: this has to be set in the  airdroppedSupply in the DebondToken
    function setAirdropedSupply(uint total_airdroped_supply)
        override external onlyAirdropOrOwner
    returns (bool) {
        // main supply has to be maintained in the dGOV supply.
        IdGOV(_token.token).setAirdroppedSupply(_airDropSupply);
        
        return true;
    }

    function setLockTime(uint lockTime_) external override onlyAirdropOrOwner {
        _lockTime = lockTime_;
    }

    function lockTime() external view returns (uint) {
        return _lockTime;
    }
//
    function mintAirdrop(address to, uint amount) virtual external onlyAirdropOrOwner returns (bool) {
 require(to != address(0), "AirdropToken: mint to the zero address");
        require(_airDropSupply >= amount, "AirdropToken: cant request for more than needed");
        _total_airdropped += amount;
       
        _token.airdropped += amount;

        IdGOV(_token.token).mintAirdropedSupply(to, _amount);

       IdGOV(_token.token).setLockedBalance(to,amount);


        return true;   
        
         }

  
//
    function lockedBalance(address account)
        external
        override
        view
        returns (uint)
    {
        return (IdGOV(_token.token).getLockedBalance(account));
    }
//
    
    function checkLockedBalance(address account, uint amount)
        external
        override
        view
        returns (bool)
    {
return IdGOV(_token.token).getLockedBalance(account) >= amount;
    }
//
    function claim() external onlyAfterTime onlyAirdropOrOwner returns (uint) {
        
    uint amountRemaining = IdGOV(_token.token).getLockedBalance(msg.sender);
        require( IdGOV(_token.token).getLockedBalance(msg.sender) >= 1, "AirdropToken: no tokens to claim");
         IdGOV(_token.token).setAirdroppedSupply(0);
         // given that all of the  airdrop locked balance is now received and .
     //   _lockedBalance[msg.sender] = 0;

     uint amountClaimed= IdGOV(_token.token).getLockedSupply();
        this.mintAirdrop(msg.sender, amountClaimed);

         IdGOV(_token.token).setLockedBalance(msg.sender , 0);


        return amountClaimed;

    }

  
    
}

