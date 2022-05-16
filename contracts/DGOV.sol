pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IDebondToken.sol";





contract DGOV is ERC20Capped, Ownable, IDebondToken, AccessControl {
    uint256 public _maximumSupply;
    uint256 public _collateralisedSupply;
    uint256 public _allocatedSupply;
    uint256 public _airdropedSupply;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    using SafeMath for uint256;

    address _bankAddress;
    address _governanceAddress;
    address _exchangeAddress;
    address _airdropAddress;
    // checks locked supply.
    mapping(address => uint256) lockedSupply;
    mapping(address => uint256 ) _airdropedBalance;
    mapping(address => uint256) _allocatedBalance;

    /**
imp: given that the core addresses themselves will be needing dbit / dgov addresses ,we will set them init 0 and then define seperately
        address bankAddress,
        address governanceAddress,
        address exchangeAddress,
        address _airdropAddress;
    */

    constructor() ERC20Capped(10 ** 18) ERC20("DGOV", "DGOV") {
        _maximumSupply = cap();
       // grantRole(MINTER_ROLE, _airdropAddress);
       // TODO: just an test for the  issuer role , for the real development add 
        grantRole(DEFAULT_ADMIN_ROLE,msg.sender);
    }


    function totalSupply() public override view returns(uint256) {
        return _collateralisedSupply + _allocatedSupply + _airdropedSupply;
    }

    // set  locked supply balance for each account
    function lockedBalance(address account) public   view returns (uint256) {
    require(msg.sender == _governanceAddress || hasRole(DEFAULT_ADMIN_ROLE,msg.sender));
    require(_collateralisedSupply >=  _airdropedSupply * _airdropedSupply, "insufficient lockTokens");
    return ((_collateralisedSupply * 1e18) / (_airdropedSupply * _airdropedSupply )/ 5e20);    
    
    }

    // Check if supply is locked function, this will be called by the transfer  function
    function _checkIfIsLockedSupply(address account, uint256 amountTransfer)
        internal
        view
        returns (bool)
    {
        return
            (lockedSupply[account] - balanceOf(account)) >=
            amountTransfer;
    }

    // read functions get the according amount of the supply.

    function allocatedSupply() public view returns (uint256) {
        return _allocatedSupply;
    }

    function AirdropedSupply() public view returns (uint256) {
        return _airdropedSupply;
    }

    function supplyCollateralised() external view returns(uint256) {
        return _collateralisedSupply;

    }

    // We need a transfer and transfer from function to replace the standarded ERC 20 functions.
    // In our functions we will be verifying if the transfered ammount <= balance - locked supply

    //bank transfer can only be called by bank contract or exchange contract, bank transfer don't need the approval of the sender.
    function directTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(msg.sender == _exchangeAddress || msg.sender == _bankAddress || msg.sender == _governanceAddress );
        require(
            _checkIfIsLockedSupply(_from, _amount) == true,
            "ERC20: can't transfer locked balance"
        );
        _transfer(_from, _to, _amount);
        return (true);
    }

    // Must be sent from the airdrop contract address which is defined in the constructor
    function mintAirdropedSupply(address _to, uint256 _amount) external {
        require(msg.sender == _airdropAddress);
        _mint(_to, _amount);
        _airdropedSupply -= _amount;
       // as the airdroped supply is minted it will be seperate from the each investors lockedSupply.
        lockedSupply[_to] +=  _amount;
    }

    /**
     */
    function mintCollateralisedSupply(address _to, uint256 _amount) external {
        require(msg.sender == _bankAddress);
        _mint(_to, _amount);
        _collateralisedSupply += _amount;
    }

    function mintAllocatedSupply(address _to, uint256 _amount) external {
        _mint(_to, _amount);
        _allocatedSupply += _amount;
    }

    function setGovernanceContract(address governance_address)
        public
        returns (bool)
    {
        _governanceAddress = governance_address;
        return (true);
    }

    function setBankContract(address bank_address) public returns (bool) {
        _bankAddress = bank_address;
        return (true);
    }



    function setExchangeContract(address exchange_address)
        public
        returns (bool)
    {
        require(msg.sender == _governanceAddress);
        _exchangeAddress = exchange_address;
        return (true);
    }

    function setAirdropContract(address new_Airdrop) public returns(bool) {
        require(msg.sender == _governanceAddress);
        _airdropAddress = new_Airdrop;
        return (true);
    }

    /** allows to set the airdrop supply after the initialisation just in case.
     */
    function setAirdroppedSupply(uint256 new_supply) public returns(bool) {
        require(  hasRole(DEFAULT_ADMIN_ROLE, msg.sender),"DGOV: ACCESS DENIED for supply chanage"
        );
        _airdropedSupply = new_supply;

    }
}
