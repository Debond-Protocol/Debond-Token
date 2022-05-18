import { expect } from "chai";
import {DGOVInstance,BankInstance, DBITAirdropInstance, ExchangeInstance, GovernanceInstance} from "../types/truffle-contracts";
const DGOV = artifacts.require("DGOV");
const DGOVAirdrop = artifacts.require("DBITAirdrop"); 
const exchange = artifacts.require("Exchange");
const governance = artifacts.require("Governance");
const bank = artifacts.require("Bank");
const web3 = require('web3');
contract("DGOV token", async (accounts: String[]) => {
let DGOVObj : DGOVInstance;
// TODO: just taken as the demo for replicating the ng the other contracts , to be removed
let Bank : BankInstance;
let Governance : GovernanceInstance
let DGOVAirdrop : DGOVAirdropInstance;
let Exchange : ExchangeInstance;

before('instantiation', async() => {
    let [deployer , user1 , User2] = accounts;
    DGOVObj = await DGOV.deployed();
    DGOVAirdrop = await DGOVAirdrop.deployed();
    Governance = await governance.deployed();
    Exchange =  await exchange.deployed();
    Bank = await bank.deployed();

});


it('DGOV token is deployed',async() => {    
    console.log(DGOVObj.address);    
    expect(DGOVObj.address).not.to.equal("");



});

it('DGOV is able to set contract address', async () => {
    expect(await DGOVObj.setAirdropContract(DGOVAirdrop.address)).not.to.equal(false);
    await DGOVObj.setExchangeContract(Exchange.address).not.to.equal(false);
    await DGOVObj.setBankContract(Bank.address).not.to.equal(false);



})



it('is able to mint the collateralised supply via bank', async() => {

await DGOVObj.mintCollateralisedSupply(User2, 100, {from: Bank.address});
expect(web3.eth.Balance(User2)).to.be(100);

});


it('able to mint the allocated supply', async() =>  {

    await DGOVObj.mintAllocatedSupply(User2, 100, {from: Governance.address});
    expect(web3.eth.Balance(User2)).to.be(100);

});



it('able to mint the airdroped supply', async() => {

await DGOVObj.mintAirdroppedSupply(User2, 100, {from: DGOVAirdrop.address});

});



it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 

await DGOVObj.mintAirdroppedSupply(User2, 100, {from: DGOVAirdrop.address});
await DGOVObj.mintAirdroppedSupply(User1, 100, {from: DGOVAirdrop.address});

// no collateralised supply 

await DGOVObj.LockedBalance(User1).to.be()



})







})