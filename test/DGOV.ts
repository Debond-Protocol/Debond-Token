import {expect} from "chai";
import {
    DGOVInstance
} from "../types/truffle-contracts";

const DGOV = artifacts.require("DGOV");

contract("DGOV token", async (accounts: any) => {

    let dgovObj: DGOVInstance;
    let [governance, bankAddress, airdropAddress, exchangeAddress, User1, user2]= accounts;

    before('instantiation', async () => {

        dgovObj = await DGOV.deployed();
        dgovObj.setAirdropAddress(airdropAddress,{from:governance});
        dgovObj.setBankAddress(bankAddress, {from:governance});
        dgovObj.setExchangeAddress(exchangeAddress,{from:governance});
        dgovObj.setIsActive(true, {from:governance});
        dgovObj.setMaxAllocationPercentage(web3.utils.toNumber(10), {from:governance});
        dgovObj.setMaxAirdropSupply(web3.utils.toNumber(100000), {from:governance});
        dgovObj.setMaxSupply(web3.utils.toNumber(1000000), {from:governance});
        // console.log("Airdrop address",await  dgovObj.airdropAddress());
        // console.log(" Bank Address", await dgovObj.bankAddress());
        // console.log("exchange Address", await dgovObj.exchangeAddress());
        // console.log("governance Address",governance);

    });


    it('DGOV token is deployed', async () => {
        console.log('DGOV deployed address:', dgovObj.address);
        expect(dgovObj.address).not.to.equal("");

    });


    it('is able to mint the collateralised supply via bank', async () => {
        const amt = web3.utils.toNumber(100);
        await dgovObj.mintCollateralisedSupply(user2, amt , {from: bankAddress});
       expect( web3.utils.toNumber(await dgovObj.getCollateralisedBalance(user2))).to.equal(amt);
    });


    it('able to mint the allocated supply', async () => {
        await dgovObj.mintAllocatedSupply(user2, web3.utils.toNumber(100), {from: governance});
        expect(web3.utils.toNumber(await dgovObj.getAllocatedBalance(user2))).to.equal(web3.utils.toNumber(100));

    });


    it('able to mint the airdroped supply', async () => {

        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        expect(web3.utils.toNumber(await dgovObj.getAirdropBalance(user2, {from: user2}))).to.equal(web3.utils.toNumber(100));

    });

    it('total supply is sum of the airdropAddress + collateral + allocated supply ', async () => {
        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintCollateralisedSupply(user2, web3.utils.toNumber(200), {from: bankAddress});
        await dgovObj.mintAllocatedSupply(user2, web3.utils.toNumber(300), {from: governance});
        console.log('total balance of user2:'+  web3.utils.toNumber(await dgovObj.getTotalBalance(user2)))
       // expect(web3.utils.toNumber(await dgovObj.getTotalBalance(user2))).to.equal(web3.utils.toNumber(600));
    });


    it('gets the locked supply initially as whole supply of airdropped tokens ', async () => {
        await dgovObj.setMaxAirdropSupply(web3.utils.toNumber(10000), {from: governance});
        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, web3.utils.toNumber(50), {from: airdropAddress});
        console.log('initial airdrop supply: '+ web3.utils.toNumber(await  dgovObj.getLockedBalance(user2)));
        expect(web3.utils.toNumber(await dgovObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(288));
    })


    it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {
        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintCollateralisedSupply(user2, web3.utils.toNumber(1000000), {from: bankAddress});
        expect(web3.utils.toNumber(await dgovObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(0));
    });




    it('gets correct locked Supply', async () => {

        await dgovObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await dgovObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await dgovObj.mintAllocatedSupply(User1, '300', {from: governance});
        await dgovObj.mintAllocatedSupply(user2, '800', {from: governance});
        await dgovObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await dgovObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        const lockedBalanceUser1 = await dgovObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await dgovObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));

        expect(web3.utils.toNumber(lockedBalanceUser1)).to.equal(web3.utils.toNumber(70));
        expect(web3.utils.toNumber(lockedBalanceUser2)).to.equal(web3.utils.toNumber(100));
    });

    it('transfer is working between any general address', async () => {
        await dgovObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await dgovObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await dgovObj.mintAllocatedSupply(User1, '300', {from: governance});
        await dgovObj.mintAllocatedSupply(user2, '800', {from: governance});
        await dgovObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await dgovObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        
        const lockedBalanceUser1 = await dgovObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await dgovObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));
        console.log('total bal of User1',web3.utils.toNumber(await dgovObj.balanceOf(User1)));
        console.log('total bal of User2',web3.utils.toNumber(await dgovObj.balanceOf(user2)));
        await dgovObj.transfer(user2,'20', {from: User1});
        expect(web3.utils.toNumber(await dgovObj.balanceOf(user2))).to.greaterThan(web3.utils.toNumber(web3.utils.toNumber(1800)));
        expect(web3.utils.toNumber(await dgovObj.balanceOf(User1))).to.lessThan(web3.utils.toNumber(web3.utils.toNumber(700)));
    });

    it('direct transfer should work correctly to transfer between exchange and bank', async () => {
        await dgovObj.mintCollateralisedSupply(bankAddress, '300', {from: bankAddress});
        await dgovObj.mintCollateralisedSupply(exchangeAddress, '900', {from: bankAddress});
        
        await dgovObj.directTransfer(exchangeAddress, '100', {from: bankAddress});
        console.log('bal for the bankAddress: ' +  web3.utils.toNumber(await dgovObj.balanceOf(exchangeAddress)));
        console.log('bal for exchangeAddress: ' +  web3.utils.toNumber((await dgovObj.balanceOf(bankAddress))));
        expect(web3.utils.toNumber(await dgovObj.balanceOf(exchangeAddress))).to.equal(web3.utils.toNumber(1000));
        expect(web3.utils.toNumber(await dgovObj.balanceOf(bankAddress))).to.equal(web3.utils.toNumber(web3.utils.toNumber(200)));
    });
})
