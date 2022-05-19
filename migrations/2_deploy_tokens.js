const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");
//const Governance = artifacts.require("Governance");
module.exports = async function (deployer, network, accounts) {
    await  deployer.deploy(DBIT, accounts[0] );
    await deployer.deploy(DGOV, accounts[0] );
    let DBITInstance = DBIT.deployed();
    let DGOVInstance = DGOV.deployed();
    
    await DBITInstance.grantRole(DEFAULT_ADMIN_ROLE,accounts[0]);
    await DGOVInstance.grantRole(DEFAULT_ADMIN_ROLE,accounts[0]); 
  };
  