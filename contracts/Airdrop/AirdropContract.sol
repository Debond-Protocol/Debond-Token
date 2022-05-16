pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../interfaces/IAirdropContract.sol";
import "../interfaces/IAirdropToken.sol";

contract AirdropContract is IAirdropContract, AccessControl {
    bytes32 public merkleRoot;
    bytes32 public immutable INITIATOR = keccak256("INITIATOR"); // role that can
    address _merkleDeployer; // for now defined  as address which will set the parameters as INITIATOR address.
    mapping(address => bool) public hasClaimed;
    mapping(uint256 => uint256) private _claimedBitMap;


    address dbit_contract;
    IAirdropToken at;
    address airdropToken;
    // events
    event MerkleProofPublished(bytes32 rootMerkle);
    event claimed(address indexed to, uint256 amount);

    constructor(
        bytes32 _merkleRoot,
        address merkleDeployer,
        address _airdropToken
    ) {
        _setupRole(INITIATOR, _merkleDeployer);
        merkleRoot = _merkleRoot;
      
        _merkleDeployer = merkleDeployer;
        airdropToken = _airdropToken;
      
        at = IAirdropToken(airdropToken);
    }

    /** this sets the airdrop supply  for the given version of the DBIT token

 */

    function setAirdrop(uint256 supply) external override returns (bool) {
        require(
            hasRole(INITIATOR, msg.sender),
            "not role access for this caller"
        );
        at.setAirdropedSupply(supply);
        return true;
    }

    function isClaimed(uint256 index) external view override returns (bool) {
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

    function setMerkleRoot(bytes32 root) external override returns (bool) {
        require(hasRole(INITIATOR, msg.sender), "not correct access");
        merkleRoot = root;
        return true;
    }

    function claim(
        uint256 index,
        address to,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        require(!this.isClaimed(index), "MultiAirdrop: Drop already claimed.");
        require(amount > 0, "MultiAirdrop: Zero amount.");
        require(
            _merkleDeployer != address(0x0),
            "MultiAirdrop: Empty account."
        );

        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidatedLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        require(!isValidatedLeaf, "Address not in merkle tree");


        require(at.getLockTime() <= block.timestamp, "still need to wait more to claim ");

        uint256 amountToClaim = at.getLockedBalance(to);
        require(amountToClaim >= 1, "there is no amount left to claim");

        at.mintAirdrop(to, amount);



        hasClaimed[to] = true;
        emit claimed(to, amount);
    }

   
    function setAirdropToken(address newTokenAddress) external returns (bool) {
        require(hasRole(INITIATOR, msg.sender), "not correct access");
        airdropToken = newTokenAddress;
    }
}
