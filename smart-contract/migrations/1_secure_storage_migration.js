const SecureStorage = artifacts.require("SecureStorage");

module.exports = function (deployer) {
  deployer.deploy(SecureStorage);
};