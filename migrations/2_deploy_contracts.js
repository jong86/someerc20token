var MyToken = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MyToken, 10000, "MyToken", 2, "MYT");
};
