const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", (accounts) => {
    //checking set function (1st set)
    it("should store a value", async () => {
        const instance = await SimpleStorage.deployed();

        //call set function
        await instance.set(42, {from: accounts[0]});

        //read stored value
        const storedValue = await instance.get();
        assert.equal(storedValue, 42, "Error, the stored value wasn't 42");
    });

    //checking updating of the value
    it("should update the value", async () => {
        const instance = await SimpleStorage.deployed();

        //update value
        await instance.set(100, {from: accounts[0]});

        //check value was updated
        const updatedValue = await instance.get();
        assert.equal(updatedValue, 100, "Error, the stored value wasn't updated")
    })
});