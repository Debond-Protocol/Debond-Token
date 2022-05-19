import { expect } from "chai";
import Web3 from "web3";
import {DBITInstance,BankInstance, DBITAirdropInstance, ExchangeInstance, GovernanceInstance} from "../types/truffle-contracts";
const DBIT = artifacts.require("DBIT");
const DBITAirdrop = artifacts.require("DBITAirdrop"); 
const web3 = require('web3');
contract("DBIT token", async (accounts: any ) => {
let dbitObj : DBITInstance;
// TODO: just taken as the demo for replicating the ng the other contracts , to be removed
let Bank : BankInstance;
let Governance : GovernanceInstance
let DBITAirdrop : DBITAirdropInstance;
let Exchange : ExchangeInstance;

let [deployer , User1 , User2, bank , exchange] = accounts;


before('instantiation', async() => {
   
   
    dbitObj = await DBIT.deployed();
    DBITAirdrop = await DBITAirdrop.deployed();
    Governance = await governance.deployed();
    Exchange =  await exchange.deployed();
    Bank = await bank.deployed();
    await dbitObj.setBankContract(bank, {from:deployer});
    await dbitObj.setExchangeContract(exchange,{from:deployer});

});


it('DBIT token is deployed',async() => {    
    console.log(dbitObj.address);    
    expect(dbitObj.address).not.to.equal("");


});

it('DBIT is able to set contract address', async () => {
    expect(await dbitObj.setAirdropContract(DBITAirdrop.address)).not.to.equal(false);
    expect(await dbitObj.setExchangeContract(Exchange.address)).not.to.equal(false);
    expect(await dbitObj.setBankContract(Bank.address)).not.to.equal(false);
})



it('is able to mint the collateralised supply via bank', async() => {

await dbitObj.mintCollateralisedSupply(User2, 100, {from: Bank.address});
expect(web3.eth.Balance(User2)).to.be('100');
});


it('able to mint the allocated supply', async() =>  {

    await dbitObj.mintAllocatedSupply(User2, 100, {from: Governance.address});
    expect(web3.eth.Balance(User2)).to.be('100');

});



it('able to mint the airdroped supply', async() => {

await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
expect(dbitObj.LockedBalance(User2, {from:User2})).to.be('100');

});

it('total supply is sum of the airdrop + collateral + allocated supply ', async() => {
await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
await dbitObj.mintCollateralisedSupply(User2,'200',{from:User2});
await dbitObj.mintAllocatedSupply(User2,300,{from:User2});
expect(dbitObj.totalSupply({from:User2})).to.equal('600');
});



it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 
await dbitObj.setAirdroppedSupply('200',{from:deployer});
await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
await dbitObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

// it should be total  max supply (1 million DBIT).
await dbitObj.LockedBalance(User2).to.be(Web3.utils.toWei('1000000000','ether'));
})


it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

    await dbitObj.setAirdroppedSupply('200',{from:deployer});
    await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
    await dbitObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

    await  dbitObj.mintCollateralisedSupply(User2, '10000000000000000000' , {from : DBITAirdrop.address});

    await dbitObj.LockedBalance(User2).to.equal('0');


});

it(' directTransfer to another address ', async() => {
     
   
    await dbitObj.mintCollateralisedSupply(bank,300, {from:bank});
    await dbitObj.mintCollateralisedSupply(exchange,300, {from:exchange});
    await dbitObj.mintAirdroppedSupply(Bank,1000, {from:Bank});
    await dbitObj.directTransfer(Bank,Exchange,600,{from : Bank});

});



it('transfer is working between any general address', async() => {
    await dbitObj.mintCollateralisedSupply(User1,300, {from:bank});
    await dbitObj.mintCollateralisedSupply(User2,900, {from:bank})  
    await dbitObj.mintAllocatedSupply(User1,300,{from:deployer} );
    await dbitObj.mintAllocatedSupply(User2,800,{from:deployer} )

    await dbitObj.directTransfer(User1 , User2 , {from:deployer});



});




})