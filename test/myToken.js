const MyToken = artifacts.require("./MyToken.sol");

contract('MyToken', accounts => {
  let instance
  let totalSupply
  const owner = accounts[0];
  const alice = accounts[1];
  const carol = accounts[2];

  before(async () => {
    instance = await MyToken.deployed()
  })

  it("defines a finite set of tokens upon deployment", async () => {
    totalSupply = await instance.contract.totalSupply.call().toString()
    assert.equal(totalSupply, 10000, "totalSupply is not 10000 after deployment");
  });

  it("confirm the owner of the contract has all the tokens", async () => {
    const ownerBalance = await instance.balanceOf.call(owner);
    assert.equal(totalSupply, ownerBalance, "owner does not have all the tokens");
  });

  it("can receive funds from a second account", async () => {
    try {
      await instance.sendTransaction({ from: alice, value: web3.toWei(0.0001, 'ether') })
      assert(true)
    } catch (e) {
      assert(false, 'could not send funds')
    }
  });

  it("has given the second account some tokens", async () => {
    const aliceBalance = await instance.balanceOf.call(alice);
    assert(aliceBalance.cmp(0) > 0, "does not have any tokens");
  })

  it("has decreased the owner's number of tokens", async () => {
    const ownerBalance = await instance.balanceOf.call(owner);
    const totalSupplyBN = web3.toBigNumber(totalSupply)
    assert(ownerBalance.cmp(totalSupplyBN) < 0, "owner does not have less tokens now");
  })

  it("can transfer tokens to a third account", async () => {
    try {
      await instance.sendTransaction({ from: carol, value: web3.toWei(0.0001, 'ether') })
      assert(true)
    } catch (e) {
      assert(false, 'could not send funds')
    }

    const carolBalance = await instance.balanceOf.call(carol);
    assert(carolBalance.cmp(0) > 0, "owner does not have less tokens now");
  })

  it("results in correct balances at the end", async () => {
    const ownerBalance = await instance.balanceOf.call(owner);
    assert(ownerBalance.cmp(8000) === 0, "owner balance correct");
    const aliceBalance = await instance.balanceOf.call(alice);
    assert(aliceBalance.cmp(1000) === 0, "alice balance correct");
    const carolBalance = await instance.balanceOf.call(carol);
    assert(carolBalance.cmp(1000) === 0, "carol balance correct");
  })
});
