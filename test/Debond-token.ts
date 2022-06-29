import {expect} from "chai";
import {
    DebondTokenInstance
} from "../types/truffle-contracts";

const DebondToken = artifacts.require("DGOV");

contract("DGOV token", async (accounts: any) => {

    let debondTokenObj: DebondTokenInstance;
    let [governance, bankAddress, airdropAddress, exchangeAddress, User1, user2]= accounts;

    before('instantiation', async () => {

        debondTokenObj = await DebondToken.deployed();
        debondTokenObj.setAirdropAddress(airdropAddress,{from:governance});
        debondTokenObj.setBankAddress(bankAddress, {from:governance});
        debondTokenObj.setExchangeAddress(exchangeAddress,{from:governance});
        debondTokenObj.setIsActive(true, {from:governance});
        debondTokenObj.setMaxAllocationPercentage(web3.utils.toNumber(10), {from:governance});
        debondTokenObj.setMaxAirdropSupply(web3.utils.toNumber(10000), {from:governance});
        // console.log("Airdrop address",await  debondTokenObj.airdropAddress());
        // console.log(" Bank Address", await debondTokenObj.bankAddress());
        // console.log("exchange Address", await debondTokenObj.exchangeAddress());
        // console.log("governance Address",governance);

    });


    it('Token is deployed', async () => {
        console.log('debond token deployed address:', debondTokenObj.address);
        expect(debondTokenObj.address).not.to.equal("");

    });


    it.only('Is able to mint the collateralised supply via bank', async () => {
        const amt = web3.utils.toNumber(100);
        await debondTokenObj.mintCollateralisedSupply(user2, amt , {from: bankAddress});
       expect(web3.utils.toNumber(await debondTokenObj.getCollateralisedBalance(user2))).to.equal(amt);
    });


    it('able to mint the allocated supply', async () => {
        await debondTokenObj.mintAllocatedSupply(user2, web3.utils.toNumber(100), {from: governance});
        expect(web3.utils.toNumber(await debondTokenObj.getAllocatedBalance(user2))).to.equal(web3.utils.toNumber(100));

    });


    it('able to mint the airdroped supply', async () => {

        await debondTokenObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        expect(web3.utils.toNumber(await debondTokenObj.getAirdropBalance(user2, {from: user2}))).to.equal(web3.utils.toNumber(100));

    });

    it('total supply is sum of the airdropAddress + collateral + allocated supply ', async () => {
        await debondTokenObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await debondTokenObj.mintCollateralisedSupply(user2, web3.utils.toNumber(200), {from: bankAddress});
        await debondTokenObj.mintAllocatedSupply(user2, web3.utils.toNumber(300), {from: governance});
        console.log('total balance of user2:'+  web3.utils.toNumber(await debondTokenObj.getTotalBalance(user2)))
        expect(web3.utils.toNumber(await debondTokenObj.getTotalBalance(user2))).to.equal(web3.utils.toNumber(600));
    });


    it('gets the locked supply initially as whole supply of airdropped tokens ', async () => {
        await debondTokenObj.setMaxAirdropSupply(web3.utils.toNumber(10000), {from: governance});
        await debondTokenObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await debondTokenObj.mintAirdropSupply(User1, web3.utils.toNumber(50), {from: airdropAddress});
        console.log('initial airdrop supply: '+ web3.utils.toNumber(await  debondTokenObj.getLockedBalance(user2)));
        expect(web3.utils.toNumber(await debondTokenObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(288));
    })


    it.only('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {
        await debondTokenObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await debondTokenObj.mintAirdropSupply(User1, web3.utils.toNumber(100), {from: airdropAddress});
        await debondTokenObj.mintCollateralisedSupply(user2, web3.utils.toNumber(1000), {from: bankAddress});
        expect(web3.utils.toNumber(await debondTokenObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(0));
    });




    it('gets correct locked Supply', async () => {

        await debondTokenObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await debondTokenObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await debondTokenObj.mintAllocatedSupply(User1, '300', {from: governance});
        await debondTokenObj.mintAllocatedSupply(user2, '800', {from: governance});
        await debondTokenObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await debondTokenObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        const lockedBalanceUser1 = await debondTokenObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await debondTokenObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));

        expect(web3.utils.toNumber(lockedBalanceUser1)).to.equal(web3.utils.toNumber(70));
        expect(web3.utils.toNumber(lockedBalanceUser2)).to.equal(web3.utils.toNumber(100));
    });

    it('transfer is working between any general address', async () => {
        await debondTokenObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await debondTokenObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await debondTokenObj.mintAllocatedSupply(User1, '300', {from: governance});
        await debondTokenObj.mintAllocatedSupply(user2, '800', {from: governance});
        await debondTokenObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await debondTokenObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        
        const lockedBalanceUser1 = await debondTokenObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await debondTokenObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));
        console.log('total bal of User1',web3.utils.toNumber(await debondTokenObj.balanceOf(User1)));
        console.log('total bal of User2',web3.utils.toNumber(await debondTokenObj.balanceOf(user2)));
        await debondTokenObj.transfer(user2,'20', {from: User1});
        expect(web3.utils.toNumber(await debondTokenObj.balanceOf(user2))).to.greaterThan(web3.utils.toNumber(web3.utils.toNumber(1800)));
        expect(web3.utils.toNumber(await debondTokenObj.balanceOf(User1))).to.lessThan(web3.utils.toNumber(web3.utils.toNumber(700)));
    });


    it('sets the max alloc percetage', async() => {
        await debondTokenObj.setMaxAllocationPercentage(web3.utils.toNumber(10), {from: governance});
        //expect(await debondTokenObj.).to.not.equal(web3.utils.toNumber(10));



    })


    it('sets the airdrop Address', async() => {

        await debondTokenObj.setAirdropAddress(accounts[8], {from: governance});
        expect(await debondTokenObj.airdropAddress()).to.not.equal(airdropAddress);

    });

    it('sets the exchange Address', async() => {

        await debondTokenObj.setExchangeAddress(accounts[8], {from: governance});
        expect(await debondTokenObj.exchangeAddress()).to.not.equal(exchangeAddress);

    });
})
