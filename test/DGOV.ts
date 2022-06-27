import {expect} from "chai";
import Web3 from "web3";
import {DGOVInstance, DBITAirdropInstance} from "../types/truffle-contracts";

const DGOV = artifacts.require("DGOV");
const web3 = require('web3');
contract("DGOV token", async (accounts: any) => {
    let dgovObj: DGOVInstance;
// TODO: just taken as the demo for replicating the ng the other contracts , to be removed
let [governance, bankAddress, airdropAddress, exchangeAddress, User1, User2]= accounts;


    before('instantiation', async () => {


        dgovObj = await DGOV.deployed();
        dgovObj.setAirdropAddress(airdropAddress,{from:governance});
        dgovObj.setBankAddress(bankAddress, {from:governance});
        dgovObj.setExchangeAddress(exchangeAddress,{from:governance});
    
        console.log("Airdrop address",await  dgovObj.airdropAddress());
        console.log(" Bank Address", await dgovObj.bankAddress());
        console.log("exchange Address", await dgovObj.exchangeAddress());
        console.log("governance Address",governance);

    });


    it('DGOV token is deployed', async () => {
        console.log(dgovObj.address);
        expect(dgovObj.address).not.to.equal("");


    });

  
    it('is able to mint the collateralised supply only  bankAddress', async () => {

        await dgovObj.mintCollateralisedSupply(User2, web3.utils.toNumber(100), {from: bankAddress});
        expect(dgovObj.getCollateralisedBalance(User2)).to.be(web3.utils.toNumber(100));
    });


    it('able to mint the allocated supply', async () => {

        await dgovObj.mintAllocatedSupply(User2, 100, {from: governance});
        expect(dgovObj.getAllocatedBalance(User2)).to.be(web3.utils.toNumber(100));

    });


    it('able to mint the airdroped supply', async () => {

        await dgovObj.mintAirdropSupply(User2, '100', {from: airdropAddress});
        expect(dgovObj.getAirdropBalance(User2, {from: User2})).to.be(Web3.utils.toWei('100', 'ether'));

    });

    it('total supply is sum of the airdrop + collateral + allocated supply ', async () => {
        await dgovObj.mintAirdropSupply(User2, '100', {from: airdropAddress});
        await dgovObj.mintCollateralisedSupply(User2, '200', {from: User2});
        await dgovObj.mintAllocatedSupply(User2, '300', {from: User2});
        expect(dgovObj.totalSupply({from: User2})).to.equal(web3.utils.toWei('600', 'ether'));
    });


    it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 
        await dgovObj.setMaxAirdropSupply('200', {from: governance});
        await dgovObj.mintAirdropSupply(User2, '100', {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, '100', {from: airdropAddress});

// it should be total  max supply (1 million DGOV).
        expect(await dgovObj.getLockedBalance(User2)).to.be(Web3.utils.toWei('1000000000', 'ether'));
    })


    it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

        await dgovObj.setMaxAirdropSupply('200', {from: governance});
        await dgovObj.mintAirdropSupply(User2, '100', {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, '100', {from: airdropAddress});

        await dgovObj.mintCollateralisedSupply(User2, '100000000', {from: bankAddress});

        expect(await dgovObj.getLockedBalance(User2)).to.equal('0');


    });

    it(' transferFrom works between bankAddress and exchange contract', async () => {

        await dgovObj.mintCollateralisedSupply(bankAddress, 300, {from: bankAddress});
        await dgovObj.mintCollateralisedSupply(exchangeAddress, 300, {from: exchangeAddress});
        await dgovObj.mintAirdropSupply(bankAddress, 1000, {from: bankAddress});
        await dgovObj.transferFrom(bankAddress, exchangeAddress, 600, {from: bankAddress});
    });


    it('transfer is working between any general address', async () => {
        await dgovObj.mintCollateralisedSupply(User1, 300, {from: bankAddress});
        await dgovObj.mintCollateralisedSupply(User2, 900, {from: bankAddress})
        await dgovObj.mintAllocatedSupply(User1, 300, {from: governance});
        await dgovObj.mintAllocatedSupply(User2, 800, {from: governance})
        await dgovObj.transfer(User1, 100, {from: User2});
    });


})
