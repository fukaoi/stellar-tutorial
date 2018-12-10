const StellarSdk = require('stellar-sdk')

class SendXlm {
  //
  // Initialize
  //
  constructor() {
    StellarSdk.Network.useTestNetwork()
    this.server      = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.publicKey   = 'Your public key'
    this.secretKey   = 'Secret key for above public key'
    this.destination = 'Send to address'    
  }

  //
  // Create transaction function 
  //
  createTransaction(account, destination, amount) {
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
  async main(amount) {
    try {
      const account = await this.server.loadAccount(this.publicKey);
      const transaction = this.createTransaction(account, this.destination, amount);
      transaction.sign(StellarSdk.Keypair.fromSecret(this.secretKey)); 
      const response = await this.server.submitTransaction(transaction);      
      console.log(response);
    } catch (error) {
      console.error(error);
    } 
  }
}

new SendXlm().main(1);