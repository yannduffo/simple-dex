const TestToken = artifacts.require("TestToken");
const fs = require("fs");

module.exports = async function (deployer) {
    //deploy 3 fictive tokens
    await deployer.deploy(TestToken, "TokenABC", "TABC", web3.utils.toWei("1000000"));
    const tokenABC = await TestToken.deployed();
    console.log("TokenABC deployed at: ", tokenABC.address);

    await deployer.deploy(TestToken, "TokenDEF", "TDEF", web3.utils.toWei("1000000"));
    const tokenDEF = await TestToken.deployed();
    console.log("TokenDEF deployed at: ", tokenDEF.address);

    await deployer.deploy(TestToken, "TokenXYZ", "TXYZ", web3.utils.toWei("1000000"));
    const tokenXYZ = await TestToken.deployed();
    console.log("TokenXYZ deployed at: ", tokenXYZ.address);

    //save token addresses on JSON files (to import then at next migration step)
    const tokesnInfo = [
        {
            name: "TokenABC",
            symbol: "TABC",
            address: tokenABC.address,
        },
        {
            name: "TokenDEF",
            symbol: "TDEF",
            address: tokenDEF.address,
        },
        {
            name: "TokenXYZ",
            symbol: "TXYZ",
            address: tokenXYZ.address,
        },
    ];
    fs.writeFileSync("build/deployedTokens.json", JSON.stringify(tokesnInfo, null, 2), "utf-8");

    console.log("TokenABC deployed at : ", tokenABC.address);
    console.log("TokenDEF deployed at : ", tokenDEF.address);
    console.log("TokenXYZ deployed at : ", tokenXYZ.address);
};