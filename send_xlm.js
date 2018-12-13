const StellarSdk = require('stellar-sdk')

class SendXlm {
  //
  // Initialize
  //
  constructor() {
    StellarSdk.Network.useTestNetwork()
    this.server      = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.publicKey   = 'GB6LCMBSMRXB7VQ3T5DVW6UHRVXEQBCJPLJZ6PQCP3BSCFOVUWNLLTDS'
    this.secretKey   = 'SB2DJZP57QNVW57DZTTQTLW333KNX477UR5DLRUBIDVC2V46OCW4UKEB'
    this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'    
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
  // Main method
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