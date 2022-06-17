const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");
const governanceOwnable = artifacts.require("GovernanceOwnable");
const Migrations = artifacts.require("Migrations");
//const Bank = artifacts.require("Bank");
// const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer,network, accounts) {
  let maxAirdropSupplyDBIT = '1000000';
  let maxAllocPercentageDBIT = '7';
  //  web3.utils.toWei(1000000000,"ether").toString();
  let maxAirdropSupplyDGOV = '1000'
   // 10% of the total supply : web3.utils.toWei(10000,"ether").toString();
  let maxAllocPercentageDGOV = '5';

  let maxSupplyDGOV = '10000000'

  const [deployerAddress] = accounts;
  await deployer.deploy(governanceOwnable, deployerAddress.toString());
  let governanceOwnableInstance= await governanceOwnable.deployed();

  let governanceOwnableAddress = governanceOwnableInstance.address;

  console.log('governance ownable address is ', governanceOwnableAddress);

  await  deployer.deploy(DBIT, governanceOwnableAddress, maxAirdropSupplyDBIT, maxAllocPercentageDBIT);

  await deployer.deploy(DGOV,governanceOwnableAddress,maxSupplyDGOV, maxAirdropSupplyDGOV , maxAllocPercentageDGOV);

    
    let DBITInstance = DBIT.deployed();
    let DGOVInstance = DGOV.deployed();
    // TODO: currently debond-exchange contract along with debond-Bank is being workedout for the changes , thus there is dummy migration contract just for basic test 
    // TODO: needs removal before the audit submission.
    
    let BankInstance = Migrations.deployed();
    let ExchangeInstance = Migrations.deployed();
    // TODO: governanceOwnable.setter functions are not detected by  compiled form.
    // await governanceOwnable.setDBITAddress(DBITInstance.address, {from : deployerAddress.toString()});
    // await governanceOwnable.setDGOVInstanceAddress(DGOVInstance.address, {from : deployerAddress.toString()});
    // await governanceOwnable.setBankAddress(BankInstance.address, {from : deployerAddress.toString()});
    // await governanceOwnable.setExchangeAddress(ExchangeInstance.address, {from : deployerAddress.toString()});
  
  
    console.log()
  
  
  };
  