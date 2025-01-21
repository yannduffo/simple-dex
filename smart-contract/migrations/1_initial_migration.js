// load "Migrations" contract  
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
    // deploy contract on default network (ganache for us)
    deployer.deploy(Migrations);
};