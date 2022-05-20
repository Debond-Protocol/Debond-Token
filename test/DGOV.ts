import { expect } from "chai";
import Web3 from "web3";
import {DGOVInstance,, DBITAirdropInstance} from "../types/truffle-contracts";
const DBIT = artifacts.require("DGOV");
const DBITAirdrop = artifacts.require("DBITAirdrop"); 
const web3 = require('web3');
contract("DBIT token", async (accounts: any ) => {
let dgovObj : DBITInstance;
// TODO: just taken as the demo for replicating the ng the other contracts , to be removed
let Bank : BankInstance;
let Governance : GovernanceInstance
let DBITAirdrop : DBITAirdropInstance;
let Exchange : ExchangeInstance;

let [deployer , User1 , User2, bank , exchange] = accounts;


before('instantiation', async() => {
   
   
    dgovObj = await DGOV.deployed();
    // TODO: to change name for the DBITAirdrop to general airdrop.
    DBITAirdrop = await DBITAirdrop.deployed();
    Governance = await governance.deployed();
    Exchange =  await exchange.deployed();
    Bank = await bank.deployed();
    await dgovObj.setBankContract(bank, {from:deployer});
    await dgovObj.setExchangeContract(exchange,{from:deployer});

});


it('DBIT token is deployed',async() => {    
    console.log(dgovObj.address);    
    expect(dgovObj.address).not.to.equal("");


});

it('DBIT is able to set contract address', async () => {
    expect(await dgovObj.setAirdropContract(DBITAirdrop.address)).not.to.equal(false);
    expect(await dgovObj.setExchangeContract(Exchange.address)).not.to.equal(false);
    expect(await dgovObj.setBankContract(Bank.address)).not.to.equal(false);
})



it('is able to mint the collateralised supply via bank', async() => {

await dgovObj.mintCollateralisedSupply(User2, 100, {from: Bank.address});
expect(web3.eth.Balance(User2)).to.be('100');
});


it('able to mint the allocated supply', async() =>  {

    await dgovObj.mintAllocatedSupply(User2, 100, {from: Governance.address});
    expect(web3.eth.Balance(User2)).to.be('100');

});



it('able to mint the airdroped supply', async() => {

await dgovObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
expect(dgovObj.LockedBalance(User2, {from:User2})).to.be('100');

});

it('total supply is sum of the airdrop + collateral + allocated supply ', async() => {
await dgovObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
await dgovObj.mintCollateralisedSupply(User2,'200',{from:User2});
await dgovObj.mintAllocatedSupply(User2,300,{from:User2});
expect(dgovObj.totalSupply({from:User2})).to.equal('600');
});



it('gets the locked supply initially as full supply ', async () => {
// setting only the airdropped supply  for the 2 users and no collateralised supply 
await dgovObj.setAirdroppedSupply('200',{from:deployer});
await dgovObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
await dgovObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

// it should be total  max supply (1 million DBIT).
await dgovObj.LockedBalance(User2).to.be(Web3.utils.toWei('1000000000','ether'));
})


it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

    await dgovObj.setAirdroppedSupply('200',{from:deployer});
    await dgovObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
    await dgovObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

    await  dgovObj.mintCollateralisedSupply(User2, '10000000000000000000' , {from : DBITAirdrop.address});

    await dgovObj.LockedBalance(User2).to.equal('0');


});

it(' directTransfer to another address ', async() => {
     
   
    await dgovObj.mintCollateralisedSupply(bank,300, {from:bank});
    await dgovObj.mintCollateralisedSupply(exchange,300, {from:exchange});
    await dgovObj.mintAirdroppedSupply(Bank,1000, {from:Bank});
    await dgovObj.directTransfer(Bank,Exchange,600,{from : Bank});

});



it('transfer is working between any general address', async() => {
    await dgovObj.mintCollateralisedSupply(User1,300, {from:bank});
    await dgovObj.mintCollateralisedSupply(User2,900, {from:bank})  
    await dgovObj.mintAllocatedSupply(User1,300,{from:deployer} );
    await dgovObj.mintAllocatedSupply(User2,800,{from:deployer} )

    await dgovObj.directTransfer(User1 , User2 , {from:deployer});



});




})