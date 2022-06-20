import { expect } from "chai";
import {DBITInstance,GovernanceOwnableInstance, DGOVInstance, MigrationsInstance} from "../types/truffle-contracts";

const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV"); 
//TODO:  here we consider the migrations to be dummy contract in order to replicate the ownership of the contract for invoking specific operations. 
const Bank = artifacts.require("Migrations");
const Exchange = artifacts.require("Migrations");
const Governance = artifacts.require("Migrations");
const Airdrop = artifacts.require("Migrations");


contract("DBIT token", async (accounts: any ) => {
let dbitObj : DBITInstance;
let dgovObj : DGOVInstance;
// TODO: to be changed.
let bankObj : MigrationsInstance;
let exchangeObj : MigrationsInstance;
let airdropObj : MigrationsInstance;

let governanceObj : MigrationsInstance;


// TODO: taken here for rep
let [deployer , User1 , User2, bank , exchange] = accounts;


before('instantiation', async() => {
    dbitObj = await DBIT.deployed();
    bankObj = await Bank.deployed();
    exchangeObj = await exchange.deployed();
    airdropObj = await Airdrop.deployed(); 
    governanceObj = await  Governance.deployed();
    // setting also the parameters 
});


it('DBIT token is deployed',async() => {    
    console.log(dbitObj.address);    
    expect(await dbitObj.address).to.not.equal('');
});

it('initial total supply is zero', async () => {
 expect(await dbitObj.totalSupply()).to.eql(0);
});


 it('DBIT mints the collateralised tokens via the bank', async () => {
    await dbitObj.mintAllocatedSupply(User1, web3.utils.toWei('1000',"ether").toString, {from: bankObj.address }); 
    expect(await dbitObj.getTotalAllocatedSupply()).to.equal(web3.utils.toWei('1000',"ether").toString);   
 });



it('is able to mint the Airdropped supply via AirdropContract', async() => {
await dbitObj.mintAirdropSupply(User2, web3.utils.toWei('100',"ether"), {from: airdropObj.address});
expect(dbitObj.balanceOf(User2)).to.be(web3.utils.toWei('100',"ether"));
});


it('able to mint the allocated supply via governance address', async() =>  {

    await dbitObj.mintAllocatedSupply(User2, web3.utils.toWei('100',"ether"), {from: governanceObj.address});
    expect(dbitObj.balanceOf(User2)).to.be('100');

});


it('total supply is sum of the airdrop + collateral + allocated supply ', async() => {
await dbitObj.mintAirdropSupply(User2, web3.utils.toWei('100',"ether"), {from: airdropObj.address});
await dbitObj.mintCollateralisedSupply(User2,web3.utils.toWei('200',"ether"),{from:User2});
await dbitObj.mintAllocatedSupply(User2,web3.utils.toWei('300',"ether"),{from:User2});
expect(dbitObj.totalSupply({from:User2})).to.equal('600');
});

it('gets the locked supply initially as full supply ', async () => {
expect(await dbitObj.getLockedBalance(User2)).to.equal(web3.utils.toWei('1000000000','ether'));
})


it('if the balance of the current airdrop supply is greater than unlockable, we will  ', async () => {
    await dbitObj.setAirdropAddress(web3.utils.toWei('200','ether'),{from:deployer});
    await dbitObj.mintAirdropSupply(User2, web3.utils.toWei('100','ether'), {from: airdropObj.address});
    // here the 5% of the given token supply will be much greater.
    await  dbitObj.mintCollateralisedSupply(User2, web3.utils.toWei('10000000000000000000','ether'), {from : airdropObj.address});
    expect(await dbitObj.getLockedBalance(User2)).to.equal('0');
});

it(' directTransfer to another address ', async() => {
     
   
    await dbitObj.mintCollateralisedSupply(bankObj.address,web3.utils.toWei('300','ether'), {from:bankObj.address});
    await dbitObj.mintCollateralisedSupply(exchangeObj.address,web3.utils.toWei('300','ether'), {from:exchangeObj.address});
    await dbitObj.mintAirdropSupply(bankObj.address,web3.utils.toWei('1000','ether'), {from:bankObj.address});
    await dbitObj.directTransfer(exchangeObj.address,web3.utils.toWei('600','ether'),{from :bankObj.address });
    expect(dbitObj.balanceOf(exchangeObj.address)).to.equal(web3.utils.toWei('900','ether'));
});



it('transfer is working between users, given the unlockedBalance is sufficient', async() => {
    await dbitObj.mintCollateralisedSupply(User1,web3.utils.toWei('300','ether'), {from:bank});
    await dbitObj.mintCollateralisedSupply(User2,web3.utils.toWei('900','ether'), {from:bank})  
    await dbitObj.mintAllocatedSupply(User1,web3.utils.toWei('300','ether'),{from:deployer});
    await dbitObj.mintAllocatedSupply(User2,web3.utils.toWei('800','ether'),{from:deployer});
    await dbitObj.transfer(User1 , web3.utils.toWei('200','ether') , {from:deployer});

    expect(dbitObj.balanceOf(User2)).to.equal(web3.utils.toWei('1900','ether'));

});




})