const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config

module.exports = class Token {
  //
  // Initialize
  //
  constructor(
  ) {
    StellarSdk.Network.useTestNetwork()
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
  }

  //
  // Create transaction function
  //
  async createTransaction(destination, asset, amount) {
    const config = {
      destination: destination,
      asset: asset,
      amount: String(amount),
    }

    const operation = () => {
      return StellarSdk.Operation.payment(config)
    }
    const account = await this.server.loadAccount(this.keypair.publicKey())
    const txbuild = new StellarSdk.TransactionBuilder(account)
      .addOperation(operation())
    return txbuild
  }

  //
  // Main method
  //
  async send(tx) {
    try {
      tx.sign(this.keypair);
      await this.server.submitTransaction(tx);
      console.log('Send success!!');
    } catch (error) {
      const err = error.response
      if (err == undefined) {
        console.error(error)
      } else if (err.data == undefined) {
        console.error(err)
      } else {
        console.error(err.data.extras.result_codes)
      }
    }
  }
}

