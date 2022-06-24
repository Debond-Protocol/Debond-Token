import {expect} from "chai";
import Web3 from "web3";
import {
    DBITInstance,
} from "../types/truffle-contracts";

const DBIT = artifacts.require("DBIT");
const web3 = require('web3');
contract("DBIT token", async (accounts: any) => {

    let dbitObj: DBITInstance;

    const [governance, bank, airdrop, user1, user2] = accounts;
    it('instantiation', async () => {

        dbitObj = await DBIT.deployed();

    });


    it('DBIT token is deployed', async () => {
        console.log(dbitObj.address);
        expect(dbitObj.address).not.to.equal("");


    });


    it('is able to mint the collateralised supply via bank', async () => {

        await dbitObj.mintCollateralisedSupply(user2, 100, {from: bank});
        expect(web3.eth.Balance(user2)).to.be('100');
    });


    it('able to mint the allocated supply', async () => {

        await dbitObj.mintAllocatedSupply(user2, 100, {from: governance});
        expect(web3.eth.Balance(user2)).to.be('100');

    });


    it('able to mint the airdroped supply', async () => {

        await dbitObj.mintAirdropSupply(user2, '100', {from: airdrop});
        expect(dbitObj.getLockedBalance(user2, {from: user2})).to.be('100');

    });

    it('total supply is sum of the airdrop + collateral + allocated supply ', async () => {
        await dbitObj.mintAirdropSupply(user2, '100', {from: airdrop});
        await dbitObj.mintCollateralisedSupply(user2, '200', {from: user2});
        await dbitObj.mintAllocatedSupply(user2, 300, {from: user2});
        expect(dbitObj.totalSupply({from: user2})).to.equal('600');
    });


    it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 
        await dbitObj.setMaxAirdropSupply('200', {from: governance});
        await dbitObj.mintAirdropSupply(user2, '100', {from: airdrop});
        await dbitObj.mintAirdropSupply(user1, '100', {from: airdrop});

// it should be total  max supply (1 million DBIT).
        (await dbitObj.getLockedBalance(user2)).to.be(Web3.utils.toWei('1000000000', 'ether'));
    })


    it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

        await dbitObj.setAirdroppedSupply('200', {from: governance});
        await dbitObj.mintAirdroppedSupply(user2, '100', {from: DBITAirdrop.address});
        await dbitObj.mintAirdroppedSupply(user1, '100', {from: DBITAirdrop.address});

        await dbitObj.mintCollateralisedSupply(user2, '10000000000000000000', {from: DBITAirdrop.address});

        await dbitObj.LockedBalance(user2).to.equal('0');


    });

    it(' directTransfer to another address ', async () => {


        await dbitObj.mintCollateralisedSupply(bank, 300, {from: bank});
        await dbitObj.mintCollateralisedSupply(airdrop, 300, {from: airdrop});
        await dbitObj.mintAirdroppedSupply(Bank, 1000, {from: Bank});
        await dbitObj.directTransfer(Bank, Exchange, 600, {from: Bank});

    });


    it('transfer is working between any general address', async () => {
        await dbitObj.mintCollateralisedSupply(user1, 300, {from: bank});
        await dbitObj.mintCollateralisedSupply(user2, 900, {from: bank})
        await dbitObj.mintAllocatedSupply(user1, 300, {from: governance});
        await dbitObj.mintAllocatedSupply(user2, 800, {from: governance})
         await dbitObj.directTransfer(user1, user2, {from: governance});


    });

})
