const TestToken = artifacts.require("TestToken");
const fs = require("fs");

module.exports = async function (deployer) {
    //deploy 2 fictive tokens
    await deployer.deploy(TestToken, "TokenABC", "TABC", web3.utils.toWei("1000000"));
    const tokenABC = await TestToken.deployed();
    console.log("TokenABC deployed at: ", tokenABC.address);

    await deployer.deploy(TestToken, "TokenDEF", "TDEF", web3.utils.toWei("1000000"));
    const tokenDEF = await TestToken.deployed();
    console.log("TokenDEF deployed at: ", tokenDEF.address);

    //save token addresses on JSON files (to import then at next migration step)
    const tokenAddresses = {
        tokenABC : tokenABC.address,
        tokenDEF : tokenDEF.address,
    };
    fs.writeFileSync("build/deployedTokens.json", JSON.stringify(tokenAddresses, null, 2), "utf-8");

    console.log("TokenABC deployed at : ", tokenABC.address);
    console.log("TokenDEF deployed at : ", tokenDEF.address);
};