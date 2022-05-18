pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IDebondToken.sol";
import "./interfaces/ICollateral.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DBIT is ERC20, IDebondToken, AccessControl, ICollateral {
    // this minter role will be for airdropToken , bank or the governance Contract
    //bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // bytes32 public constant
    uint256 public _collateralisedSupply;
    uint256 public _allocatedSupply;
    uint256 public _lockedSupply;
    uint256 public _airdroppedSupply;

    address _bankAddress;
    address _governanceAddress;
    address _exchangeAddress;
    // checks locked supply.
    mapping(address => uint256) collateralisedBalance;
    mapping(address => uint256) allocatedBalance;
    mapping(address => uint256) _airdroppedBalance;

    /** currently setting only the main token parameters , and once the other contracts are deployed then use setContractAddress to set up these contracts.
     */

    constructor() ERC20("DBIT Token", "DBIT") {}

    function totalSupply()
        public
        view
        virtual
        override(ERC20)
        returns (uint256)
    {
        return
            _allocatedSupply +
            _collateralisedSupply +
            _lockedSupply +
            _airdroppedSupply;
    }

    function allocatedSupply() public view returns (uint256) {
        return _allocatedSupply;
    }

    // just an contract for formality given that current version doesnt have to be minted for DBIT.
    function airdropedSupply() public view returns (uint256) {
        return _airdroppedSupply;
    }

    function supplyCollateralised()
        external
        view
        override(ICollateral, IDebondToken)
        returns (uint256)
    {
        return _collateralisedSupply;
    }

    function getLockedSupply() external view returns (uint256) {
        return _lockedSupply;
    }

    function LockedBalance(address account) external returns (uint256) {
        

        return  (1**8-(2 * _collateralisedSupply *(1**9)) / _airdroppedSupply) * (_airdroppedBalance[account] /1**8);
    }

    function _checkIfItsLockedSupply(address from, uint256 amountToTransfer)
        internal
        returns (bool)
    {
        return ((balanceOf(from) - this.LockedBalance(from)) >=
            amountToTransfer);
    }

    // We need a transfer and transfer from function to replace the standarded ERC 20 functions.
    // In our functions we will be verifying if the transfered ammount <= balance - locked supply

    //bank transfer can only be called by bank contract or exchange contract, bank transfer don't need the approval of the sender.
    function directTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(msg.sender == _exchangeAddress || msg.sender == _bankAddress);

        require(_checkIfItsLockedSupply(_from, _amount), "insufficient supply");

        _transfer(_from, _to, _amount);
        return (true);
    }

    /**
     */
    function mintCollateralisedSupply(address _to, uint256 _amount)
        external
        virtual
        override
    {
        require(msg.sender == _bankAddress);
        _mint(_to, _amount);
        _collateralisedSupply += _amount;
        collateralisedBalance[_to] += _amount;
    }

    function mintAllocatedSupply(address _to, uint256 _amount)
        external
        override
    {
        require(msg.sender == _governanceAddress);
        _mint(_to, _amount);
        _allocatedSupply += _amount;
        allocatedBalance[_to] += _amount;
    }

    function mintAirdroppedSupply(address _to, uint256 _amount)
        external
        override
    {
        require(msg.sender == _governanceAddress);
        _mint(_to, _amount);
        _airdroppedSupply += _amount;
        _airdroppedBalance[_to] += _amount;
    }

    function setGovernanceContract(address governance_address)
        public
        returns (bool)
    {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        _governanceAddress = governance_address;
        return (true);
    }

    function setBankContract(address bank_address) public returns (bool) {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        _bankAddress = bank_address;
        return (true);
    }

    function setExchangeContract(address exchange_address)
        public
        returns (bool)
    {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        _exchangeAddress = exchange_address;
        return (true);
    }
}
