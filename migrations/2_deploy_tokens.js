const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");

module.exports = function (deployer) {
    deployer.deploy(DBIT);
    deployer.deploy(DGOV);
  };
  