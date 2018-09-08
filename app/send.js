let StellarSDK = require('stellar-sdk')
StellarSDK.Network.useTestNetwork();

let server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
let sourceKeys = StellarSDK.Keypair.fromSecret('');
let destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

var transaction;

server.loadAccount(destinationId).catch(StellarSDK.NotFoundError, (error) => {
  throw new Error('The destination account does not exist!');
})

  .then(() => {
    return server.loadAccount(sourceKeys.publicKey())
  })
  .then((sourceAccount) => { 
    transaction = new StellarSDK.TransactionBuilder(sourceAccount)
      .addOperation(StellarSDK.Operation.payment({
        destination: destinationId,
        asset: StellarSDK.Asset.native(),
        amount: '10'
      }))
      .addMemo(StellarSDK.Memo.text('Test Transaction')).build();
    
    transaction.sign(sourceKeys);
    return server.submitTransaction(transaction);
  }) 
  .then((result) => {
    console.log('Success result', result);
  })
  .catch((error) => {
    console.error('Error!', error);
  })
