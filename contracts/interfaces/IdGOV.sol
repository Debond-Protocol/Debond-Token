pragma solidity ^0.8.9;



interface IdGOV { 

    function setLockedBalance(address) external ;

    function allocatedSupply() external view returns (uint256);

    function AirdropedSupply() external view returns (uint256);   
    /**getting locked balance for the given address */
    function getLockedBalance(address account) external view returns (uint256);

    function directTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);

    function mintAirdropedSupply(address _to, uint256 _amount) external;

    function mintCollateralisedSupply(address _to, uint256 _amount) external;

    function mintAllocatedSupply(address _to, uint256 _amount) external;

    function setGovernanceContract(address governance_address)
        external
        returns (bool);

    function setBankContract(address bank_address) external returns (bool);
    
    function setExchangeContract(address exchange_address)
        external
        returns (bool);


    function setAirdropContract(address new_Airdrop) external returns(bool);

    /**
    only set by airdropToken (which is further called by airdrop contract) in order to set airdrop token supply  
     */
    function setAirdroppedSupply(uint256 new_supply) external returns(bool); 

}

