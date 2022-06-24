const DBIT = artifacts.require("DBIT");
const DGOV = artifacts.require("DGOV");
module.exports = async function (deployer, network, accounts) {
    const [governanceAddress, bankAddress, airdropAddress,exchangeAddress] = accounts;

    await deployer.deploy(DBIT, governanceAddress, bankAddress, airdropAddress ,exchangeAddress);
    await deployer.deploy(DGOV, governanceAddress, bankAddress, airdropAddress,exchangeAddress);
  };
