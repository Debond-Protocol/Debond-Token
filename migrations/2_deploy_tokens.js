const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");

module.exports = async function (deployer, accounts) {
    await  deployer.deploy(DBIT);
    await deployer.deploy(DGOV);
  };
  