// load the contract "SimpleStorage"
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
    // deploy contract on default network (ganache for us)
    deployer.deploy(SimpleStorage);
};