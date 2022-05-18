pragma solidity ^0.8.9;
interface IDBITAirdrop {

    function merkleVerify(bytes32[] memory proof, bytes32 root, bytes32 leaf) external pure returns (bool);
    function claimStatus(address _to) external view returns (bool);

    function claimAirdrop(bytes32[]  memory _proof, uint256 airdrop_index, address _to, uint256 _amount) external  returns (bool);
    function setAirdrop(bytes32 _merkleRoot)external returns (bool);
    function startClaim()external view returns (bool);

}