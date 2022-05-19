const DBITAirdrop = artifacts.require("DBITAirdrop");
const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");
const Exchange = artifacts.require("Exchange");
//  const Bank = artifacts.require("Bank");
// const Exchange = artifacts.require("Exchange");
module.exports = async function (deployer,accounts) {

    let deployerAccount = accounts[0];
    let ClaimStarting = "1652867301"; // this needs to be set in UNIX based on the airdrop campaign starting.
    let claimDuration = "2629743"; // by default one month.
    let DBITInstance =  await DBIT.deployed();
    let DBITAddress = DBITInstance.address;
    DBITInstance.grantRole(DEFAULT_ADMIN_ROLE,deployer);

    await deployer.deploy(DBITAirdrop,DBITAddress, ClaimStarting, claimDuration);

    let DBITAirdropInstance = DBITAirdrop.deployed();
    /**
     * setting up the address 
     *  await 
     * 
     * 
     */




  };
  


