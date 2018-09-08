var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Keys for accounts to issue and receive the new asset
var issuingKeys = StellarSdk.Keypair
  .fromSecret('SAEHS4V4TCKTJBPCUWJYDFWGECEBH3RKRZ7JHFALGOJGUY34XM6QNK7X');
var receivingKeys = StellarSdk.Keypair
  .fromSecret('SBQEBVNICAHX6UPBH3IP4F4PYOUH5F22TLPEOTOGXLUXGKELF47LQDNA');

// Create an object to represent the new asset
var astroDollar2 = new StellarSdk.Asset('AstroDollar2', issuingKeys.publicKey());

// First, the receiving account must trust the asset
server.loadAccount(receivingKeys.publicKey())
  .then(function(receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver)
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: astroDollar2,
        limit: '1000',
        setFlags: StellarSdk.AuthRevocableFlag | StellarSdk.AuthRequiredFlag
      }))
      .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })

  // Second, the issuing account actually sends a payment using the asset
  .then(function() {
    return server.loadAccount(issuingKeys.publicKey())
  })
  .then(function(issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.payment({
        destination: receivingKeys.publicKey(),
        asset: astroDollar2,
        amount: '1'
      }))
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .catch(function (error) {
    console.error("error!!");
    console.log(error);
  });