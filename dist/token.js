'use strict';

var _stellarSdk = require('stellar-sdk');

var _stellarSdk2 = _interopRequireDefault(_stellarSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_stellarSdk2.default.Network.useTestNetwork();
var server = new _stellarSdk2.default.Server('https://horizon-testnet.stellar.org');
var issuingKeys = _stellarSdk2.default.Keypair.fromSecret('SAEHS4V4TCKTJBPCUWJYDFWGECEBH3RKRZ7JHFALGOJGUY34XM6QNK7X');
var receivingKeys = _stellarSdk2.default.Keypair.fromSecret('SBQEBVNICAHX6UPBH3IP4F4PYOUH5F22TLPEOTOGXLUXGKELF47LQDNA');

console.log(issuingKeys.publicKey(), receivingKeys.publicKey());

var jpyx = new _stellarSdk2.default.Asset('JPYX', issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey()).then(function (receiver) {
  var transaction = new _stellarSdk2.default.TransactionBuilder(receiver).addOperation(_stellarSdk2.default.Operation.changeTrust({
    asset: jpyx,
    limit: "10000"
  })).build();
  receiver.balances.some(function (balance) {
    console.log(balance);
  });
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
  issuer.balances.some(function (balance) {
    console.log(balance);
  });
  transaction.sign(issuingKeys);
  return server.submitTransaction(transaction);
}).catch(function (error) {
  console.error('Stellar Error!!!');
  console.log(error.response.data.extras);
});