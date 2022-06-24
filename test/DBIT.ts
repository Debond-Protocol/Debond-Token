import {expect} from "chai";
import Web3 from "web3";
import {
    DBITInstance
} from "../types/truffle-contracts";

const DBIT = artifacts.require("DBIT");

contract("DBIT token", async (accounts: any) => {

    let dbitObj: DBITInstance;
    let [governance, bankAddress, airdropAddress, exchangeAddress, User1, user2]= accounts;

    before('instantiation', async () => {

        dbitObj = await DBIT.deployed();
        dbitObj.setAirdropAddress(airdropAddress,{from:governance});
        dbitObj.setBankAddress(bankAddress, {from:governance});
        dbitObj.setExchangeAddress(exchangeAddress,{from:governance});
    
        console.log("Airdrop address",await  dbitObj.airdropAddress());
        console.log(" Bank Address", await dbitObj.bankAddress());
        console.log("exchange Address", await dbitObj.exchangeAddress());
        console.log("governance Address",governance);

    });


    it('DBIT token is deployed', async () => {
        console.log('DBIT deployed address:', dbitObj.address);
        expect(dbitObj.address).not.to.equal("");

    });


    it.only('is able to mint the collateralised supply via bank', async () => {
        const amt = web3.utils.toWei('100','wei');
        await dbitObj.mintCollateralisedSupply(user2, amt , {from: bankAddress});
       expect( web3.utils.toWei(await dbitObj.getCollateralisedBalance(user2),'wei')).to.equal(amt);
    });


    it('able to mint the allocated supply', async () => {
        await dbitObj.mintAllocatedSupply(user2, 100, {from: governance});
        expect(await dbitObj.getAllocatedBalance(user2)).to.equal('100');

    });


    it('able to mint the airdroped supply', async () => {

        await dbitObj.mintAirdropSupply(user2, '100', {from: airdropAddress});
        expect(dbitObj.getLockedBalance(user2, {from: user2})).to.be('100');

    });

    it('total supply is sum of the airdropAddress + collateral + allocated supply ', async () => {
        await dbitObj.mintAirdropSupply(user2, '100', {from: airdropAddress});
        await dbitObj.mintCollateralisedSupply(user2, '200', {from: user2});
        await dbitObj.mintAllocatedSupply(user2, 300, {from: user2});
        expect(dbitObj.totalSupply({from: user2})).to.equal('600');
    });


    it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 
        await dbitObj.setMaxAirdropSupply('200', {from: governance});
        await dbitObj.mintAirdropSupply(user2, '100', {from: airdropAddress});
        await dbitObj.mintAirdropSupply(User1, '100', {from: airdropAddress});

// it should be total  max supply (1 million DBIT).
        (await dbitObj.getLockedBalance(user2)).to.be(Web3.utils.toWei('1000000000', 'ether'));
    })


    it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

        await dbitObj.mintAirdropSupply('200', {from: User1});
        await dbitObj.mintAirdropSupply(user2, '100', {from: airdropAddress});
        await dbitObj.mintAirdropSupply(User1, '100', {from: airdropAddress});

        await dbitObj.mintCollateralisedSupply(user2, '10000000000000000000', {from: airdropAddress});

        expect(await dbitObj.getLockedBalance(user2)).to.equal('0');


    });

    it(' directTransfer to another address ', async () => {


        await dbitObj.mintCollateralisedSupply(bankAddress, 300, {from: bankAddress});
        await dbitObj.mintCollateralisedSupply(airdropAddress, 300, {from: airdropAddress});
        await dbitObj.mintAirdropSupply(bankAddress, 1000, {from: bankAddress});
        await dbitObj.transferFrom(bankAddress, exchangeAddress, 600, {from: bankAddress});

    });


    it('transfer is working between any general address', async () => {
        await dbitObj.mintCollateralisedSupply(User1, 300, {from: bankAddress});
        await dbitObj.mintCollateralisedSupply(user2, 900, {from: bankAddress})
        await dbitObj.mintAllocatedSupply(User1, 300, {from: governance});
        await dbitObj.mintAllocatedSupply(user2, 800, {from: governance})
         await dbitObj.transferFrom(User1, user2, {from: governance});


    });

})
