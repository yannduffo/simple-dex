const DexSwap = artifacts.require("DexSwap");

module.exports = async function(deployer) {
    await deployer.deploy(DexSwap);
    const dexSwap = await DexSwap.deployed();
    console.log("DexSwap deployed at : ", dexSwap.address);
}