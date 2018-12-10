const StellarSdk = require('stellar-sdk')

//
// Initialize
//
StellarSdk.Network.useTestNetwork()
const server      = new StellarSdk.Server('https://horizon-testnet.stellar.org')
const publicKey   = 'Your public key'
const secretKey   = 'Secret key for above public key'
const destination = 'Send to address'


//
// Create transaction function 
//
const createTransaction = (account, destination, amount) => {
  const config = {
    destination: destination,
    asset: StellarSdk.Asset.native(),
    amount: String(amount)
  }

  const tx = new StellarSdk.TransactionBuilder(account)
  .addOperation(StellarSdk.Operation.payment(config))
  .build()
  return tx
}

//
// Main function
//
const main = async (amount) => {
  try {
    const account = await server.loadAccount(publicKey);
    const transaction = createTransaction(account, destination, amount);
    transaction.sign(StellarSdk.Keypair.fromSecret(secretKey)); 
    const response = await server.submitTransaction(transaction);      
    console.log(response);
  } catch (error) {
    console.error(error);
  } 
}

main(1)  // send 1XLM