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
// Main
//
server
  .loadAccount(publicKey)
  .then(account => {
    const transaction = createTransaction(account, destination, 0.0001)
    transaction.sign(StellarSdk.Keypair.fromSecret(secretKey)) 
    return server.submitTransaction(transaction)
  })
  .then(res => console.log(res))
  .catch(err => console.error(err))

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
