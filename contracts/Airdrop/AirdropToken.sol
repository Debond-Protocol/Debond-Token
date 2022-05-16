pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAirdropToken.sol";
import "./interfaces/IdGOV.sol";

contract AirdropToken is IAirdropToken, Ownable {
    uint256 public _airDropSupply;// to be taken from airdrop token
    uint256 public _total_airdropped; // current supply that is unlocked and supplied
    uint256 public _lockTime; // this is the timestamp after which the claim can be executed.

    address dGOVAddress;
    address minter_address; // here the minter is airdrop Contract.

    
    mapping(address => uint256 ) _lockedSupply;


    modifier onlyAfterTime() {
        require(
            _lockTime <= block.timestamp,
            "AirdropToken: too early for claim"
        );
        _;
    }

    constructor(
        address _dGOVAddress,
        uint256 lockTime_,
        address _minter_address
    ) {
        require(
            dGOVAddress != address(0x0),
            "cant define Address(0) as airdrop"
        );
        dGOVAddress = _dGOVAddress;
        _lockTime = lockTime_;
        minter_address = _minter_address; // setting first address(0) and then changing afterwards. 
        _airDropSupply = IdGOV(dGOVAddress).AirdropedSupply();
    
    }

    

    function setLockTime(uint256 lockTime_) external {
        require(
            msg.sender == minter_address,
            "AirdropToken: Not an airdrop contract"
        );
        _lockTime = lockTime_;
    }

    function getLockTime() external view returns(uint256) {
        return _lockTime;
    }

    function mintAirdrop(address to, uint256 amount) external returns (bool) {
        require(
            msg.sender == minter_address,
            "AirdropToken: Not an airdrop contract"
        );

        require(to != address(0), "AirdropToken: incorrect address ");

        require(_airDropSupply >= amount, "AirdropToken: cant ask more than limit");



        IdGOV(dGOVAddress).mintAirdropedSupply(to, amount);

        _total_airdropped += amount;
        _airDropSupply -= amount;
        return true;
    }


    function setAirdropContractAddress(address newAddr) onlyOwner external returns(bool) {
        minter_address = newAddr;
        return true;
    }


    function setAirdropedSupply (uint256 total_airdroped_supply)
        external  
        onlyOwner
        returns (bool)
        {

        IdGOV(dGOVAddress).setAirdroppedSupply(total_airdroped_supply);
        return true;
        }
    function getLockedBalance(address account)
        external
        view
        override
        returns (uint256)
    {
        return (IdGOV(dGOVAddress).lockedBalance(account));
    }

    

    function setdGOV(address _dGOVAddress) external onlyOwner returns (bool) {
        require(msg.sender == minter_address, "only airdrop contract");
        dGOVAddress = _dGOVAddress;
        return (true);
    }
}
