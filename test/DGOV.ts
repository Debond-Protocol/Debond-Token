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
        dgovObj.setMaxAirdropSupply(web3.utils.toNumber(10000), {from:governance});
        dgovObj.setMaxSupply(web3.utils.toNumber(10000000), {from:governance});
    });
    
    it('DGOV token is deployed', async () => {
        console.log('DGOV deployed address:', dgovObj.address);
        expect(dgovObj.address).not.to.equal("");

    });


    it('is able to mint the collateralised supply via bank  sufficient amount of traversal', async () => {
        const amt = web3.utils.toNumber(100);
        await dgovObj.mintCollateralisedSupply(user2, amt , {from: bankAddress});
       expect(web3.utils.toNumber(await dgovObj.getCollateralisedBalance(user2))).to.equal(amt);
    });


    it('able to mint the allocated supply with the sufficient ', async () => {
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


    it('mint allocated supply should work for higher values then airdrop supply  ', async () => {
        dgovObj.setMaxSupply(web3.utils.toNumber(10000000), {from:governance});
        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, web3.utils.toNumber(50), {from: airdropAddress});
        await dgovObj.(User1, web3.utils.toNumber(50), {from: airdropAddress});
        expect(web3.utils.toNumber(await dgovObj.getLockedBalance(user2))).to.equal(web3.utils.toNumber(288));
    })


    it('mint collateralised supply should work for higher values than airdrop supply ', async () => {
        dgovObj.setMaxSupply(web3.utils.toNumber(10000000), {from:governance});
        await dgovObj.mintAirdropSupply(user2, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintAirdropSupply(User1, web3.utils.toNumber(100), {from: airdropAddress});
        await dgovObj.mintCollateralisedSupply(user2, web3.utils.toNumber(1000), {from: bankAddress});
        expect(web3.utils.toNumber(await dgovObj.getCollateralisedBalance(user2))).to.equal(web3.utils.toNumber(1000));
    });




   
  
 
})
