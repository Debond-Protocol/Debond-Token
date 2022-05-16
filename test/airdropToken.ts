import {AirdropTokenInstance, AirdropContractInstance, DBITInstance} from '../types/truffle-contracts';
import {MerkleTree} from  'merkletreejs';
import { before } from 'mocha';
const keccak256 = require('keccak256')


contract('airdropToken', async(accounts: string[]) => {

    const DBIT = artifacts.require("DBIT");
    const AirdropContract  =artifacts.require("AirdropContract");
    const AirdropTokenContract  = artifacts.require("AirdropToken");
   
    let deployer = accounts[4];
    let DBITContract: DBITInstance;
    let Airdrop: AirdropContractInstance;
    let AirdropToken: AirdropTokenInstance

    const AirdropAddressLeaves = [accounts[0], accounts[1], accounts[2], accounts[3]].map(value =>keccak256(value));

    const merkleRoot = new MerkleTree(AirdropAddressLeaves,keccak256).toString();
     
    before( async() => {
    DBITContract = await DBIT.deployed();

    await DBITContract.transfer(accounts[0], 100);

    await DBITContract.transfer(accounts[1], 100);

    await DBITContract.transfer(accounts[2], 100);

    await DBITContract.transfer(accounts[3], 100);

    let airdropToken = await AirdropTokenContract.new(DBITContract.address,'10',accounts[5]);

    let airdropContract = AirdropContract.new(DBITContract.address,merkleRoot, deployer, airdropToken.address);
    });
    it('initialize', async() => {
        console.log(merkleRoot);
        console.log(await DBITContract.address);    
       
    });


    it('user is not able to recover the lokcable tokens before the locktime', async() => {
        
    });







})