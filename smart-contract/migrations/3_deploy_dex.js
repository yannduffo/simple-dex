const DexPool = artifacts.require("DexPool");
const fs = require("fs");

module.exports = async function (deployer) {
    //read tokens addresses stored on JSON file
    const tokenAddresses = JSON.parse(fs.readFileSync("build/deployedTokens.json", "utf-8"));
    const tokenABCAddress = tokenAddresses.tokenABC;
    const tokenDEFAddress = tokenAddresses.tokenDEF;

    //logs 
    console.log("Deploying DexPool with tokens:");
    console.log("TokenABC:", tokenABCAddress);
    console.log("TokenDEF:", tokenDEFAddress);

    //deploying DEX
    await deployer.deploy(DexPool, tokenABCAddress, tokenDEFAddress, "LPToken", "LPT");
    const dexPool = await DexPool.deployed();
    console.log("DexPool deployed at: ", dexPool.address);
}