import { expect } from "chai";
import {
    DBITInstance
} from "../types/truffle-contracts";

const DBIT = artifacts.require("DBIT");

contract("DBIT Token", async (accounts: any) => {

    let dbitObj: DBITInstance;
    let [governanceAddress, bankAddress, airdropAddress, exchangeAddress, user1, user2, user3] = accounts;

    before('Instantiation', async () => {
        dbitObj = await DBIT.deployed();
        dbitObj.setAirdropAddress(airdropAddress, { from: governanceAddress });
        dbitObj.setBankAddress(bankAddress, { from: governanceAddress });
        dbitObj.setExchangeAddress(exchangeAddress, { from: governanceAddress });
        dbitObj.setIsActive(true, { from: governanceAddress });
        dbitObj.setMaxAllocationPercentage(web3.utils.toNumber(9999), { from: governanceAddress });
        dbitObj.setMaxAirdropSupply(web3.utils.toNumber(500000), { from: governanceAddress });
    });

    it('DBIT Token Deployment', async () => {
        console.log('DBIT deployed address:', dbitObj.address);
        expect(dbitObj.address).not.to.equal("");

    });


    it('Total Supply Mint and Check', async () => {
        const amt = web3.utils.toNumber(1000);

        //Initial supply is 0
        expect(web3.utils.toNumber(await dbitObj.totalSupply())).to.equal(0);

        //Mint all three types of supplies for user 1
        await dbitObj.mintAirdropSupply(user1, amt, { from: airdropAddress });
        await dbitObj.mintCollateralisedSupply(user1, amt, { from: bankAddress });
        await dbitObj.mintAllocatedSupply(user1, amt, { from: governanceAddress });

        //Mint all three types of supplies for user 2
        await dbitObj.mintAirdropSupply(user2, amt, { from: airdropAddress });
        await dbitObj.mintCollateralisedSupply(user2, amt, { from: bankAddress });
        await dbitObj.mintAllocatedSupply(user2, amt, { from: governanceAddress });

        //Check if total supply is 6*amount
        expect(web3.utils.toNumber(await dbitObj.totalSupply())).to.equal(6 * amt);

    });


    it('Collateralized Supply Mint and Check', async () => {
        const amt = web3.utils.toNumber(1000);
        await dbitObj.mintCollateralisedSupply(user1, amt, { from: bankAddress });

        //Check if collateralized supply is 2000+1000 = 3000
        expect(web3.utils.toNumber(await dbitObj.getTotalCollateralisedSupply())).to.equal(3 * amt);

    });

    it('Airdrop Supply Mint and Check', async () => {
        const amt = web3.utils.toNumber(1000);
        await dbitObj.mintAirdropSupply(user1, amt, { from: airdropAddress });

        //Check if Airdrop supply is 2000+1000 = 3000
        expect(web3.utils.toNumber(await dbitObj.getTotalAirdropSupply())).to.equal(3 * amt);
        expect(web3.utils.toNumber(await dbitObj.getMaxAirdropSupply())).to.equal(500000);
    });


    it('Allocated Supply Mint and Check', async () => {
        const amt = web3.utils.toNumber(1000);
        await dbitObj.mintAllocatedSupply(user1, amt, { from: governanceAddress });

        //Check if Allocated supply is 2000+1000 = 3000
        expect(web3.utils.toNumber(await dbitObj.getTotalAllocatedSupply())).to.equal(3 * amt);
        expect(web3.utils.toNumber(await dbitObj.getMaxAllocatedPercentage())).to.equal(9999);
    });

    it('User Total Balance Check', async () => {
        const amt = web3.utils.toNumber(1000);

        expect(web3.utils.toNumber(await dbitObj.getTotalBalance(user1))).to.equal(6 * amt);
        expect(web3.utils.toNumber(await dbitObj.getTotalBalance(user2))).to.equal(3 * amt);
    });


    it('User Locked Balance Check', async () => {
        /*
        CS = 3000
        AS = 3000
        Max_Unlocked = 5% of 3000 (CS) = 150
        Since Max_Unlocked < AS:
            Unlocked_Ratio = 150/AS = 150/3000
        User 1 Locked Balance = User 1  Airdrop Balance * (1-Unlocked Ratio) = 2000*(1-150/3000) = 1900
        User 2 Locked Balance = User 2  Airdrop Balance * (1-Unlocked Ratio) = 1000*(1-150/3000) = 950
        */
        expect(web3.utils.toNumber(await dbitObj.getLockedBalance(user1))).to.equal(1900);
        expect(web3.utils.toNumber(await dbitObj.getLockedBalance(user2))).to.equal(950);
    });

    it('User Collateralized Balance Check', async () => {
        const amt = web3.utils.toNumber(1000);
        expect(web3.utils.toNumber(await dbitObj.getCollateralisedBalance(user1))).to.equal(2 * amt);
        expect(web3.utils.toNumber(await dbitObj.getCollateralisedBalance(user2))).to.equal(amt);
    });

    it('User Allocated Balance Check', async () => {
        const amt = web3.utils.toNumber(1000);
        expect(web3.utils.toNumber(await dbitObj.getAllocatedBalance(user1))).to.equal(2 * amt);
        expect(web3.utils.toNumber(await dbitObj.getAllocatedBalance(user2))).to.equal(amt);
    });

    it('User Airdrop Balance Check', async () => {
        const amt = web3.utils.toNumber(1000);
        expect(web3.utils.toNumber(await dbitObj.getAirdropBalance(user1))).to.equal(2 * amt);
        expect(web3.utils.toNumber(await dbitObj.getAirdropBalance(user2))).to.equal(amt);
    });

    it('Airdrop Supply Set and Check', async () => {
        await dbitObj.setMaxAirdropSupply(10000, { from: governanceAddress });
        expect(web3.utils.toNumber(await dbitObj.getMaxAirdropSupply())).to.equal(10000);
    });

    it('Allocation Percentage Set and Check', async () => {
        await dbitObj.setMaxAllocationPercentage(900, { from: governanceAddress });
        expect(web3.utils.toNumber(await dbitObj.getMaxAllocatedPercentage())).to.equal(900);
    });


    it('Transfer Check', async () => {
        await dbitObj.transfer(user3, 100, { from: user1 });
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user3))).to.equal(100);
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user1))).to.equal(5900);
        //Note: The getTotalBalance() still gives the same balance.

        await dbitObj.mintCollateralisedSupply(user3, 1000, { from: bankAddress });
        await dbitObj.transfer(user2, 1050, { from: user3 });
        await dbitObj.transfer(user2, 50, { from: user3 });
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user3))).to.equal(0);
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user2))).to.equal(4100);
    });

    it('Transfer From Check', async () => {

        await dbitObj.approve(governanceAddress, 100, { from: user1 })
        await dbitObj.transferFrom(user1, user2, 100, { from: governanceAddress });
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user2))).to.equal(4200);
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user1))).to.equal(5800);
        //Note: The getTotalBalance() still gives the same balance.

    });

    it('Burn DBIT', async () => {

        let balanceDBIT = await dbitObj.balanceOf(user1)
        let colSupply = await dbitObj.getTotalCollateralisedSupply()
        await dbitObj.burn(user1, 10, {from: bankAddress});
        let expected = web3.utils.toNumber(balanceDBIT) - 10
        let expected2 = web3.utils.toNumber(colSupply) - 10
        expect(web3.utils.toNumber(await dbitObj.balanceOf(user1))).to.equal(expected);
        expect(web3.utils.toNumber(await dbitObj.getTotalCollateralisedSupply())).to.equal(expected2);


    });
})