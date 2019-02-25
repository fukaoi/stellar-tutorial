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
  createTransaction(accountObj) {
    const operation = () => {
      return StellarSdk.Operation.setOptions({})
    }
    const transaction = new StellarSdk.TransactionBuilder(accountObj)
      .addOperation(operation())
      .build()
    return transaction
  }


  //
  // Run authorize
  //
  async run(assetCode, auth = false) {
    const account = await this.server.loadAccount(this.keypair.publicKey());
    const transaction = this.createTransaction(account)
    transaction.addOperation(
      StellarSdk.Operation.allowTrust({
        trustor: account,
        assetCode: assetCode,
        authorize: auth
      })
    )
    transaction.build()
    transaction.sign(this.keypair)
    await this.server.submitTransaction(transaction);
    console.log('Authorize success!!');
  }
}

