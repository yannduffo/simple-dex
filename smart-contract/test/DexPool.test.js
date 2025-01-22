const TestToken = artifacts.require("TestToken");
const DexPool = artifacts.require("DexPool");

const web3 = global.web3; //using web3 instance configured by truffle

const chai = require("chai");
const chaiBN = require("chai-bn")(web3.utils.BN);
chai.use(chaiBN);
const {expect} = chai;



contract("DexPool", (accounts) => {
    const [owner, user1, user2] = accounts;

    let tokenABC, tokenDEF, dexPool;

    beforeEach(async () => {
        //deploy 2 tokens for the tests
        tokenABC = await TestToken.new("TokenABC", "TABC", web3.utils.toWei('100000'));
        tokenDEF = await TestToken.new("TokenDEF", "TDEF", web3.utils.toWei('100000'));

        //deploy the dex
        dexPool = await DexPool.new(tokenABC.address, tokenDEF.address, "LPToken", "LPT");

        //distribute tokens to users
        await tokenABC.transfer(user1, web3.utils.toWei('1000'));
        await tokenDEF.transfer(user1, web3.utils.toWei('1000'));

        await tokenABC.transfer(user2, web3.utils.toWei('1000'));
        await tokenDEF.transfer(user2, web3.utils.toWei('1000'));
    });

    it("should initialize correctly", async () => {
        //checking reserve values
        const reserve1 = await dexPool.reserve1();
        const reserve2 = await dexPool.reserve2();
        expect(reserve1.toString()).to.equal("0");
        expect(reserve2.toString()).to.equal("0");

        //checking tokens initialisation
        const tokenABCAddress = await dexPool.token1();
        const tokenDEFAddress = await dexPool.token2();
        expect(tokenABCAddress).to.equal(tokenABC.address);
        expect(tokenDEFAddress).to.equal(tokenDEF.address);
    });

    it("should allow adding liquidity", async () => {
        //approve the 2 tokens before sending them to the pool
        await tokenABC.approve(dexPool.address, web3.utils.toWei("100"), {from: user1});
        await tokenDEF.approve(dexPool.address, web3.utils.toWei("100"), {from: user1});

        //adding 100 tokenABC and 100 tokenDEF to the liquidity pool
        //no need to specify which token we are adding where cause it's define at contract creation
        await dexPool.addLiquidity(web3.utils.toWei("100"), web3.utils.toWei("100"), {from : user1});

        //checking if the liquidity pool is properly filled
        const reserve1 = await dexPool.reserve1();
        const reserve2 = await dexPool.reserve2();
        expect(reserve1.toString()).to.equal(web3.utils.toWei("100"));
        expect(reserve2.toString()).to.equal(web3.utils.toWei("100"));    
    });

    it("should allow swaps", async () => {
        //approve and add liquidity
        await tokenABC.approve(dexPool.address, web3.utils.toWei("100"), {from: user1});
        await tokenDEF.approve(dexPool.address, web3.utils.toWei("100"), {from: user1});
        await dexPool.addLiquidity(web3.utils.toWei("100"), web3.utils.toWei("100"), {from : user1});

        //approve and swap tokens
        await tokenABC.approve(dexPool.address, web3.utils.toWei("10"), {from: user2});
        //swapping 10 TABC to "at least" 9 TDEF
        await dexPool.swapTokens(
            tokenABC.address, 
            tokenDEF.address, 
            web3.utils.toWei("10"), 
            web3.utils.toWei("9"), 
            {from: user2}
        );

        //checking the swap
        const user2TDEFBalance = await tokenDEF.balanceOf(user2);
        //convert values to BigNumbers
        const balanceBN = web3.utils.toBN(user2TDEFBalance);
        const expectedBalanceBN = web3.utils.toBN(web3.utils.toWei("1009"));

        expect(balanceBN).to.be.a.bignumber.that.is.gt(expectedBalanceBN);
    });
});