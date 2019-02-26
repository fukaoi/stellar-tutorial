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
    this.destination = 'GB2VHA5W3CHEWEYCVTK3UKB66DP4CXAYKUKNBBFIHDSF3U7ATLRYENIT'
    // this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'
  }

  //
  // Create transaction function
  //
  async createTransaction(assetCode, auth) {
    const account = await this.server.loadAccount(this.keypair.publicKey())
    const operation = () => {
      return StellarSdk.Operation.allowTrust({
        trustor: this.destination,
        assetCode: assetCode,
        authorize: auth})
    }
    const tx = new StellarSdk.TransactionBuilder(account)
      .addOperation(operation()).build()
    return tx
  }

  //
  // Run authorize
  //
  async run(assetCode, auth = false) {
    const transaction = await this.createTransaction(assetCode, auth)
    transaction.sign(this.keypair)
    await this.server.submitTransaction(transaction)
    console.log('Authorize success!!');
  }
}

