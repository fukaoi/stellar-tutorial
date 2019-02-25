const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config

module.exports = class Authorize {
  //
  // Initialize
  //
  constructor(
  ) {
    StellarSdk.Network.useTestNetwork()
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
    this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'
  }

  //
  // Create transaction function
  //
  async createTransaction() {
    const account = await this.server.loadAccount(this.keypair.publicKey())
    return new StellarSdk.TransactionBuilder(account, {})
  }

  allowTrust(transaction) {
    return transaction.addOperation(StellarSdk.Operation.allowTrust({
        trustor: this.destination,
        assetCode: assetCode,
        authorize: auth
      })
    )
  }


  //
  // Run authorize
  //
  async run(assetCode, auth = false) {
    const transaction = await this.createTransaction()
    const addTransaction = this.allowTrust(transaction)
    console.log(addTransaction)
   await this.server.submitTransaction(tx.build().sign(this.keypair))
    console.log('Authorize success!!');
  }
}

