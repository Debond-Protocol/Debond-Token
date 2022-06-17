import { expect } from "chai";
import {DBITInstance,GovernanceOwnableInstance, DGOVInstance, MigrationsInstance} from "../types/truffle-contracts";

const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV"); 
const Bank = artifacts.require("Migrations");
const Exchange = artifacts.require("Migrations");
const airdrop = artifacts.require("Migrations");


contract("DBIT token", async (accounts: any ) => {
let dbitObj : DBITInstance;
let dgovObj : DGOVInstance;
// TODO: to be changed.
let bankObj : MigrationsInstance;
let exchangeObj : MigrationsInstance;
let airdropObj : MigrationsInstance;

let governanceOwnable : GovernanceOwnableInstance;

// TODO: taken here for rep
let [deployer , User1 , User2, bank , exchange] = accounts;


before('instantiation', async() => {
    dbitObj = await DBIT.deployed();
    dgovObj = await DGOV.deployed();
 //   expect(dgovObj.address).to.not.be('');
});


it('DBIT token is deployed',async() => {    
    console.log(dbitObj.address);    
    expect(await dbitObj.address).to.not.be('');


});

it('initial total supply is zero', async () => {
 expect(await dbitObj.totalSupply()).to.eql(0);


});


 it('DBIT mints the collateralised tokens via the bank', async () => {
    
    expect(dbitObj.mintAllocatedSupply()).to.be.greaterThan(1);

 });



// it('is able to mint the collateralised supply via bank', async() => {

// await dbitObj.mintCollateralisedSupply(User2, 100, {from: Bank.address});
// expect(web3.eth.Balance(User2)).to.be('100');
// });


// it('able to mint the allocated supply', async() =>  {

//     await dbitObj.mintAllocatedSupply(User2, 100, {from: Governance.address});
//     expect(web3.eth.Balance(User2)).to.be('100');

// });



// it('able to mint the airdroped supply', async() => {

// await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
// expect(dbitObj.LockedBalance(User2, {from:User2})).to.be('100');

// });

// it('total supply is sum of the airdrop + collateral + allocated supply ', async() => {
// await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
// await dbitObj.mintCollateralisedSupply(User2,'200',{from:User2});
// await dbitObj.mintAllocatedSupply(User2,300,{from:User2});
// expect(dbitObj.totalSupply({from:User2})).to.equal('600');
// });



// it('gets the locked supply initially as full supply ', async () => {
// // setting only the airdropped supply  for the 2 users and no collateralised supply 
// await dbitObj.setAirdroppedSupply('200',{from:deployer});
// await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
// await dbitObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

// // it should be total  max supply (1 million DBIT).
// await dbitObj.LockedBalance(User2).to.be(Web3.utils.toWei('1000000000','ether'));
// })


// it('if the collateralised supply gets bigger than airdropped supply , there is no locked balance', async () => {

//     await dbitObj.setAirdroppedSupply('200',{from:deployer});
//     await dbitObj.mintAirdroppedSupply(User2, '100', {from: DBITAirdrop.address});
//     await dbitObj.mintAirdroppedSupply(User1, '100', {from: DBITAirdrop.address});

//     await  dbitObj.mintCollateralisedSupply(User2, '10000000000000000000' , {from : DBITAirdrop.address});

//     await dbitObj.LockedBalance(User2).to.equal('0');


// });

// it(' directTransfer to another address ', async() => {
     
   
//     await dbitObj.mintCollateralisedSupply(bank,300, {from:bank});
//     await dbitObj.mintCollateralisedSupply(exchange,300, {from:exchange});
//     await dbitObj.mintAirdroppedSupply(Bank,1000, {from:Bank});
//     await dbitObj.directTransfer(Bank,Exchange,600,{from : Bank});

// });



// it('transfer is working between any general address', async() => {
//     await dbitObj.mintCollateralisedSupply(User1,300, {from:bank});
//     await dbitObj.mintCollateralisedSupply(User2,900, {from:bank})  
//     await dbitObj.mintAllocatedSupply(User1,300,{from:deployer} );
//     await dbitObj.mintAllocatedSupply(User2,800,{from:deployer} )

//     await dbitObj.directTransfer(User1 , User2 , {from:deployer});



// });




})