'use strict';

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_stellarSdk2.default.Network.useTestNetwork();
var server = new _stellarSdk2.default.Server('https://horizon-testnet.stellar.org');
var issuingKeys = _stellarSdk2.default.Keypair.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
var receivingKeys = _stellarSdk2.default.Keypair.fromSecret('SDSAVCRE5JRAI7UFAVLE5IMIZRD6N6WOJUWKY4GFN34LOBEEUS4W2T2D');

console.log(issuingKeys.publicKey(), receivingKeys.publicKey());

var jpyx = new _stellarSdk2.default.Asset('JPYX', issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey()).then(function (receiver) {
  var transaction = new _stellarSdk2.default.TransactionBuilder(receiver).addOperation(_stellarSdk2.default.Operation.changeTrust({
    asset: jpyx
  })).build();
  transaction.sign(receivingKeys);
  return server.submitTransaction(transaction);
}).then(function () {
  return server.loadAccount(issuingKeys.publicKey());
}).then(function (issuer) {
  var transaction = new _stellarSdk2.default.TransactionBuilder(issuer).addOperation(_stellarSdk2.default.Operation.payment({
    destination: receivingKeys.publicKey(),
    asset: jpyx,
    amount: "10"
  })).build();
  transaction.sign(issuingKeys);
  return server.submitTransaction(transaction);
}).catch(function (error) {
  console.error('Stellar Error!!!', error);
});