const DexFactory = artifacts.require("DexFactory");

module.exports = async function(deployer) {
    //deploy dexFactory instance
    await deployer.deploy(DexFactory);
    const dexFactory = await DexFactory.deployed();

    console.log("DexFactory deployed at: ", dexFactory.address);
}