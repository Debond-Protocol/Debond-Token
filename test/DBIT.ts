import {expect} from "chai";
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
        dbitObj.setIsActive(true, {from:governance});
        dbitObj.setMaxAllocationPercentage(web3.utils.toNumber(10), {from:governance});
        dbitObj.setMaxAirdropSupply(web3.utils.toNumber(100000), {from:governance});
        console.log("Airdrop address",await  dbitObj.airdropAddress());
        console.log(" Bank Address", await dbitObj.bankAddress());
        console.log("exchange Address", await dbitObj.exchangeAddress());
        console.log("governance Address",governance);

    });


    it('DBIT token is deployed', async () => {
        console.log('DBIT deployed address:', dbitObj.address);
        expect(dbitObj.address).not.to.equal("");

    });


    it('is able to mint the collateralised supply via bank', async () => {
        const amt = web3.utils.toNumber(100);
        await dbitObj.mintCollateralisedSupply(user2, amt , {from: bankAddress});
       expect( web3.utils.toNumber(await dbitObj.getCollateralisedBalance(user2))).to.equal(amt);
    });


    it('able to mint the allocated supply', async () => {
        await dbitObj.mintAllocatedSupply(user2, web3.utils.toNumber(100), {from: governance});
        expect(web3.utils.toNumber(await dbitObj.getAllocatedBalance(user2))).to.equal(web3.utils.toNumber(100));

    });


    it('able to mint the airdroped supply', async () => {

        await dbitObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        expect(web3.utils.toNumber(await dbitObj.getAirdropBalance(user2, {from: user2}))).to.equal(web3.utils.toNumber(100));

    });

    it('total supply is sum of the airdropAddress + collateral + allocated supply ', async () => {
        await dbitObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dbitObj.mintCollateralisedSupply(user2, web3.utils.toNumber(200), {from: bankAddress});
        await dbitObj.mintAllocatedSupply(user2, web3.utils.toNumber(300), {from: governance});
        console.log('total balance of user2:'+  web3.utils.toNumber(await dbitObj.getTotalBalance(user2)))
        expect(web3.utils.toNumber(await dbitObj.getTotalBalance(user2))).to.equal(web3.utils.toNumber(600));
    });


    it('gets the locked supply initially as whole supply of airdropped tokens ', async () => {
        await dbitObj.setMaxAirdropSupply(web3.utils.toNumber(200), {from: governance});
        await dbitObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dbitObj.mintAirdropSupply(User1, web3.utils.toNumber(100), {from: airdropAddress});
     expect(web3.utils.toNumber(await dbitObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(100));
    })


    it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

        await dbitObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dbitObj.mintAirdropSupply(User1, web3.utils.toNumber(100), {from: airdropAddress});

        await dbitObj.mintCollateralisedSupply(user2, web3.utils.toNumber(1000000), {from: bankAddress});

        expect(web3.utils.toNumber(await dbitObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(0));


    });




    it('gets correct locked Supply', async () => {

        await dbitObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await dbitObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await dbitObj.mintAllocatedSupply(User1, '300', {from: governance});
        await dbitObj.mintAllocatedSupply(user2, '800', {from: governance});
        await dbitObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await dbitObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        const lockedBalanceUser1 = await dbitObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await dbitObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));

        expect(web3.utils.toNumber(lockedBalanceUser1)).to.equal(web3.utils.toNumber(70));
        expect(web3.utils.toNumber(lockedBalanceUser2)).to.equal(web3.utils.toNumber(100));
    });

    it('transfer is working between any general address', async () => {
        await dbitObj.mintCollateralisedSupply(User1, '300', {from: bankAddress});
        await dbitObj.mintCollateralisedSupply(user2, '900', {from: bankAddress});
        await dbitObj.mintAllocatedSupply(User1, '300', {from: governance});
        await dbitObj.mintAllocatedSupply(user2, '800', {from: governance});
        await dbitObj.mintAirdropSupply(User1, '100', {from:airdropAddress});
        await dbitObj.mintAirdropSupply(user2, '100', {from:airdropAddress});
        
        const lockedBalanceUser1 = await dbitObj.getLockedBalance(User1,{from: User1});
        const lockedBalanceUser2 = await dbitObj.getAirdropBalance(user2, {from:user2});
        console.log('locked bal of  user1',web3.utils.toNumber(lockedBalanceUser1));
        console.log('locked bal of  user2',web3.utils.toNumber(lockedBalanceUser2));
        console.log('total bal of User1',web3.utils.toNumber(await dbitObj.balanceOf(User1)));
        console.log('total bal of User2',web3.utils.toNumber(await dbitObj.balanceOf(user2)));
        await dbitObj.transfer(user2,'20', {from: User1});
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user2))).to.greaterThan(web3.utils.toNumber(web3.utils.toNumber(1800)));
        expect(web3.utils.toNumber(await dbitObj.balanceOf(User1))).to.lessThan(web3.utils.toNumber(web3.utils.toNumber(700)));
    });

    it('direct transfer should work correctly to transfer between exchange and bank', async () => {
        await dbitObj.mintCollateralisedSupply(bankAddress, '300', {from: bankAddress});
        await dbitObj.mintCollateralisedSupply(exchangeAddress, '900', {from: bankAddress});
        
        await dbitObj.directTransfer(exchangeAddress, '100', {from: bankAddress});
        console.log('bal for the bankAddress: ' +  web3.utils.toNumber(await dbitObj.balanceOf(exchangeAddress)));
        console.log('bal for exchangeAddress: ' +  web3.utils.toNumber((await dbitObj.balanceOf(bankAddress))));
        expect(web3.utils.toNumber(await dbitObj.balanceOf(exchangeAddress))).to.equal(web3.utils.toNumber(1000));
        expect(web3.utils.toNumber(await dbitObj.balanceOf(bankAddress))).to.equal(web3.utils.toNumber(web3.utils.toNumber(200)));
    });
})
