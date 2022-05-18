require('truffle-test-utils').init();

import {Multi}

const { Buffer } = require('buffer');
const MerkleTree = require('merkle-tree-solidity');

const ganache = require('ganache-cli');

const { checkProof, merkleRoot, checkProofSolidityFactory } = MerkleTree;

const { sha3 } = require('ethereumjs-util');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { contract, accounts } = require('@openzeppelin/test-environment');
const assert = require('assert');
const { ether, expectRevert, expectEvent, constants, BN } = require('@openzeppelin/test-helpers');

const MultiAirdropContract = contract.fromArtifact('MultiAirdrop');
const TokenContract = contract.fromArtifact('SigmoidAirdropToken');
[owner, governance, user1, user2, user3, user4] = accounts;

function makeTreeElement(idx, address, amount) {
  return Buffer.from(
    web3.utils
      .soliditySha3(
        { type: 'uint256', value: idx },
        { type: 'address', value: address },
        { type: 'uint256', value: amount }
      )
      .substr(2),
    'hex'
  );
}

const testAmount = 100;
const elements = [user1, user2, user3, user4].map((e, i) => makeTreeElement(i, e, testAmount));
const merkleTree = MerkleTree.default(elements);
let AirdropTokenInstance;
let MultiAirdropInstance;
const airdropped = 10000;
//MultiAirdrop test script
contract('MultiAirdrop', async function(doneTest) {
  it('migrateContract', async function() {
    MultiAirdropInstance = await MultiAirdropContract.new({ from: owner });
  });
  it('migrateToken', async function() {
    AirdropTokenInstance = await TokenContract.new(
      MultiAirdropInstance.address,
      MultiAirdropInstance.address,
      MultiAirdropInstance.address,
      MultiAirdropInstance.address,
      0,
      'TEST_token',
      'TEST',
      { from: owner }
    );
  });
  //test setAirDrop function
  it('setAirDrop', async function() {
    const ret = await MultiAirdropInstance.setAirDrop(
      merkleTree.getRoot(),
      [{ token: AirdropTokenInstance.address, airdropped }],
      { from: owner }
    );
    assert.equal(true, ret.receipt.status);
  });
  // test totalMinted function
  it('totalMinted', async function() {
    const ret = await MultiAirdropInstance.totalMinted(AirdropTokenInstance.address);
    assert.equal(airdropped, ret.words[0]);
  });
  // test totalMinted function
  it('merkleRoot', async function() {
    const ret = await MultiAirdropInstance.merkleRoot();
    assert.equal('0x' + merkleTree.getRoot().toString('hex'), ret);
  });
  // test tokens function
  it('tokens', async function() {
    const ret = await MultiAirdropInstance.tokens();
    assert.equal(AirdropTokenInstance.address, ret[0].token);
    assert.equal(airdropped, Number(ret[0].airdropped));
  });
  // test setMerkleRoot function
  it('setMerkleRoot', async function() {
    await MultiAirdropInstance.setMerkleRoot(
      Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
      { from: owner }
    );
    const ret = await MultiAirdropInstance.merkleRoot();
    assert.equal('0x0000000000000000000000000000000000000000000000000000000000000000', ret);
    await MultiAirdropInstance.setMerkleRoot(merkleTree.getRoot(), { from: owner });
    const ret2 = await MultiAirdropInstance.merkleRoot();
    assert.equal('0x' + merkleTree.getRoot().toString('hex'), ret2);
  });
  // test isClaimed function before claim
  it('isClaimed false', async function() {
    const ret = await MultiAirdropInstance.isClaimed(1);
    assert.equal(false, ret);
  });
  // test claim function
  it('claim', async function() {
    const element = makeTreeElement(1, user2, testAmount);
    const proof = merkleTree.getProof(element);
    const ret = await MultiAirdropInstance.claim(1, user2, testAmount, proof, {
      from: owner
    });
    assert.equal('Claimed', ret.logs[0].event);
  });
  // test isClaimed function after claim
  it('isClaimed true', async function() {
    const ret = await MultiAirdropInstance.isClaimed(1);
    assert.equal(true, ret);
  });
  doneTest();
});