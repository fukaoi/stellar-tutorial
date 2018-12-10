const StellarSdk = require('stellar-sdk')

//
// Initialize
//
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const publicKey = 'Your public key';
const secretKey = 'Secret key for above public key';


//
// Main
//
server
  .loadAccount(publicKey)
  .then(account => {
    const transaction = createTransaction(account);
    transaction.sign(StellarSdk.Keypair.fromSecret(secretKey)); 
    return server.submitTransaction(transaction);
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));

//
// Create transaction function 
//
const createTransaction = account => {
  const paymentConfig = {
    destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
    asset: StellarSdk.Asset.native(),
    amount: "10"
  }

  const tx = new StellarSdk.TransactionBuilder(account)
  .addOperation(StellarSdk.Operation.payment(paymentConfig))
  .build();
  return tx;
}  
