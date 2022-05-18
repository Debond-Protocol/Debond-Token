pragma solidity ^0.8.0;
import "../interfaces/IDebondToken.sol";
import "../interfaces/IDBITAirdrop.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DBITAirdrop is IDBITAirdrop, Ownable {
    address dbitAddress;
    IDebondToken token;

    uint256 claimStart; // initial timestamp for starting the airdrop claim by the users
    uint256 claimDuration; // time taken (in sec) for the completion of the claim time

    bool public claim_started = false;
    bool public merkleRoot_set = false;
    bytes32 public merkleRoot; //airdrop_list_mercleRoof
    // checks whether the call is executed.
    mapping(address => bool) public withdrawClaimed;

    constructor(
        address DBITAddress,
        uint256 _claimStart,
        uint256 _claimDuration
    ) {
        dbitAddress = DBITAddress;
        token = IDebondToken(DBITAddress);
        claimStart = _claimStart;
        claimDuration = _claimDuration;
    }

    function merkleVerify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        return computedHash == root;
    }

    function claimStatus(address _to) public view returns (bool) {
        if (withdrawClaimed[_to] == true) {
            return true;
        }

        return false;
    }

    // _amount is the amount of SASH Credit no need to enter decimals _amount 1  = 1 SASH
    function claimAirdrop(
        bytes32[] memory _proof,
        uint256 airdrop_index,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(_amount > 0, "must be an greater amount");
        require(claim_started == true, "initial claim time isnt passed.");
        require(
            block.timestamp <= claimStart + claimDuration,
            "SASH Credit Airdrop: Time limit passed."
        );
        bytes32 node = keccak256(abi.encodePacked(airdrop_index, _to, _amount));
        assert(merkleVerify(_proof, merkleRoot, node) == true);
        require(
            claimStatus(_to) == false,
            "SASH Credit Airdrop: Drop already claimed."
        );

        token.mintAirdroppedSupply(_to, _amount);
        withdrawClaimed[_to] = true;

        return true;
    }

    function setAirdrop(bytes32 _merkleRoot) public returns (bool) {
        require(
            msg.sender == owner(),
            "DBIT Credit Airdrop: core team can init."
        );
        require(
            block.timestamp >= claimDuration,
            "SASH Credit Airdrop: too early."
        );
        require(
            claim_started == false,
            "SASH Credit Airdrop: already started."
        );
        merkleRoot = _merkleRoot;
        merkleRoot_set = true;
        return true;
    }

    function startClaim() public returns (bool) {
        require(msg.sender == owner(), "SASH Credit Airdrop: Dev only.");
        require(block.timestamp >= claimDuration, "SASH Credit Airdrop: too early.");
        require(
            claim_started == false,
            "SASH Credit Airdrop: Claim already started."
        );
        require(
            merkleRoot_set == true,
            "SASH Credit Airdrop: Merkle root invalid."
        );
        claim_started == true;
        return true;
    }
}
