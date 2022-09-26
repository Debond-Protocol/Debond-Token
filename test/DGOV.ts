import { expect } from "chai";
import {
    DGOVInstance
} from "../types/truffle-contracts";
const DGOV = artifacts.require("DGOV");

contract("DGOV Token", async (accounts: any) => {

    let dgovObj: DGOVInstance;
    let [governanceAddress, bankAddress, airdropAddress, exchangeAddress, user1, user2] = accounts;

    before('Instantiation', async () => {
        dgovObj = await DGOV.deployed();
        await dgovObj.updateAirdropAddress(airdropAddress, { from: governanceAddress });
        await dgovObj.updateBankAddress(bankAddress, { from: governanceAddress });
        await dgovObj.setIsActive(true, { from: governanceAddress });
        await dgovObj.setMaxAllocationPercentage(web3.utils.toNumber(1000), { from: governanceAddress });
        await dgovObj.setMaxAirdropSupply(web3.utils.toNumber(250000), { from: governanceAddress });
        await dgovObj.setMaxSupply(web3.utils.toNumber(1000000), { from: governanceAddress });
    });

    it('DGOV Token Deployment', async () => {
        console.log('DGOV deployed address:', dgovObj.address);
        expect(dgovObj.address).not.to.equal("");
    });

    it('Max Supply Check', async () => {
        expect(web3.utils.toNumber(await dgovObj.getMaxSupply())).to.equal(1000000);

    });

    it('Max Collateralized Supply Check', async () => {
        /*
            MS = 1000000
            Air.S = 250000
            Allo.S = 100000
            CS = TS - Air.S - Allo.S = 650000
        */
        expect(web3.utils.toNumber(await dgovObj.getMaxCollateralisedSupply())).to.equal(650000);
    });

    it('Max Allocated Supply Check', async () => {
        //10% of MS = 100000
        expect(web3.utils.toNumber(await dgovObj.getMaxAllocatedSupply())).to.equal(100000);
    });

    it('Mint Collateralized Supply Check', async () => {
        await dgovObj.mintCollateralisedSupply(user1, 650000, { from: bankAddress });
        expect(web3.utils.toNumber(await dgovObj.balanceOf(user1))).to.equal(web3.utils.toNumber(await dgovObj.getTotalCollateralisedSupply()));
    });

    it('Mint Allocated Supply Check', async () => {
        await dgovObj.mintAllocatedSupply(user2, 100000, { from: governanceAddress });
        expect(web3.utils.toNumber(await dgovObj.balanceOf(user2))).to.equal(web3.utils.toNumber(await dgovObj.getTotalAllocatedSupply()));
    });

    it('Set Max Supply Check', async () => {
        await dgovObj.setMaxSupply(2000000, { from: governanceAddress });
        expect(web3.utils.toNumber(await dgovObj.getMaxSupply())).to.equal(2000000);
        expect(web3.utils.toNumber(await dgovObj.getMaxAllocatedSupply())).to.equal(200000);
        expect(web3.utils.toNumber(await dgovObj.getMaxCollateralisedSupply())).to.equal(1550000);
    });
})