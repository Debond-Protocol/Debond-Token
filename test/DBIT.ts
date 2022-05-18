import { expect } from "chai";
import {DBITInstance,BankInstance, DBITAirdropInstance, ExchangeInstance, GovernanceInstance} from "../types/truffle-contracts";
const DBIT = artifacts.require("DBIT");
const DBITAirdrop = artifacts.require("DBITAirdrop"); 
const exchange = artifacts.require("Exchange");
const governance = artifacts.require("Governance");
const bank = artifacts.require("Bank");
const web3 = require('web3');
contract("DBIT token", async (accounts: String[]) => {
let dbitObj : DBITInstance;
// TODO: just taken as the demo for replicating the ng the other contracts , to be removed
let Bank : BankInstance;
let Governance : GovernanceInstance
let DBITAirdrop : DBITAirdropInstance;
let Exchange : ExchangeInstance;

before('instantiation', async() => {
    let [deployer , user1 , User2] = accounts;
    dbitObj = await DBIT.deployed();
    DBITAirdrop = await DBITAirdrop.deployed();
    Governance = await governance.deployed();
    Exchange =  await exchange.deployed();
    Bank = await bank.deployed();

});


it('DBIT token is deployed',async() => {    
    console.log(dbitObj.address);    
    expect(dbitObj.address).not.to.equal("");



});

it('DBIT is able to set contract address', async () => {
    expect(await dbitObj.setBankContract(DBITAirdrop.address)).not.to.equal(false);
    await dbitObj.setExchangeContract(Exchange.address).not.to.equal(false);
    await dbitObj.setBankContract(Bank.address).not.to.equal(false);



})



it('is able to mint the collateralised supply via bank', async() => {

await dbitObj.mintCollateralisedSupply(User2, 100, {from: Bank.address});
expect(web3.eth.Balance(User2)).to.be(100);

});


it('able to mint the allocated supply', async() =>  {

    await dbitObj.mintAllocatedSupply(User2, 100, {from: Governance.address});
    expect(web3.eth.Balance(User2)).to.be(100);

});



it('able to mint the airdroped supply', async() => {

await dbitObj.mintAirdroppedSupply(User2, 100, {from: DBITAirdrop.address});

});



it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 

await dbitObj.mintAirdroppedSupply(User2, 100, {from: DBITAirdrop.address});
await dbitObj.mintAirdroppedSupply(User1, 100, {from: DBITAirdrop.address});


})







})