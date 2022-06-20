const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");
const governanceOwnable = artifacts.require("GovernanceOwnable");
// TODO: just an dummy representation of contract for role based address, replace it before actual deployement.
const governance = artifacts.require("Migrations");
const Migrations = artifacts.require("Migrations");


module.exports = async function (deployer,network, accounts) {
  let maxAirdropSupplyDBIT =  web3.utils.toWei('1000000','ether');
  let maxAllocPercentageDBIT = '7'
  //  web3.utils.toWei(1000000000,"ether").toString();
  let maxAirdropSupplyDGOV = web3.utils.toWei('1000000000','ether');
   // 10% of the total supply : web3.utils.toWei(10000,"ether").toString();
  let maxAllocPercentageDGOV = '5';

  let maxSupplyDGOV = web3.utils.toWei('1000000000','ether');

  const [deployerAddress] = accounts;
  await deployer.deploy(governanceOwnable, deployerAddress.toString());
  
  
  let governanceOwnableInstance= await governanceOwnable.deployed();

  let governanceOwnableAddress = await governanceOwnableInstance.address;

  console.log('governance ownable address is ', governanceOwnableAddress);

  await  deployer.deploy(DBIT, governanceOwnableAddress, maxAirdropSupplyDBIT, maxAllocPercentageDBIT);

  await deployer.deploy(DGOV,governanceOwnableAddress,maxSupplyDGOV, maxAirdropSupplyDGOV , maxAllocPercentageDGOV);

    
    let DBITInstance = DBIT.deployed();
    let DGOVInstance = DGOV.deployed();
    let BankInstance = Migrations.deployed();
    let ExchangeInstance = Migrations.deployed();
    
    
  // setting up initial account parameters. 
    DBITInstance.setBankAddress(BankInstance.address, {from:governanceOwnableAddress});
    DBITInstance.setExchangeAddress(ExchangeInstance.address, {from: governanceOwnableAddress});
    DBITInstance.setGovernanceAddress(deployer, {from:governanceOwnableAddress});
    DBITInstance.setMaxAllocationPercentage(maxAllocPercentageDBIT);
    DBITInstance.setMaxAirdropSupply(maxAirdropSupplyDBIT);

    DGOVInstance.setBankAddress(BankInstance.address, {from:governanceOwnableAddress});
    DGOVInstance.setExchangeAddress(ExchangeInstance.address, {from: governanceOwnableAddress});
    DGOVInstance.setGovernanceAddress(GovernanceInstance.address, {from:governanceOwnableAddress});
    DGOVInstance.setMaxSupply(maxSupplyDGOV);
    DGOVInstance.setMaxAllocationPercentage(maxAllocPercentageDGOV);
    DGOVInstance.setMaxAirdropSupply(maxAirdropSupplyDGOV);



  };
  