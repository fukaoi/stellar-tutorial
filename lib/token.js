const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config

module.exports = class Token {
  //
  // Initialize
  //
  constructor(assetObject = StellarSdk.Asset.native()) {
    StellarSdk.Network.useTestNetwork()
    this.server      = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
    this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'
    this.assetObject = assetObject
  }

  //
  // Create transaction function
  //
  createTransaction(accountObject, destination, amount) {
    const config = {
      destination: destination,
      asset: this.assetObject,
      amount: String(amount)
    }

    const operation = () => {
      return StellarSdk.Operation.payment(config)
    }
    const tx = new StellarSdk.TransactionBuilder(accountObject)
    .addOperation(operation())
    .build()
    return tx
  }

  //
  // check balance, asset code, asset issure
  //
  async checks() {
    try {
      const account = await this.server.loadAccount(this.keypair.publicKey());
      const res = account.balances.map(bl => {
        return {
          asset_type: bl.asset_type,
          balance: bl.balance
        }
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  //
  // Decode from xdr binary object
  //
  decode(xdrData) {
    return JSON.stringify(StellarSdk.xdr.TransactionResult.fromXDR(xdrData, 'base64'))
  }

  //
  // Main method
  //
  async send(amount) {
    try {
      const account = await this.server.loadAccount(this.keypair.publicKey());
      const transaction = this.createTransaction(account, this.destination, amount);
      transaction.sign(this.keypair);
      await this.server.submitTransaction(transaction);
      console.log('Send success!!');
    } catch (error) {
      console.error(error.response.data.extras.result_codes)
    }
  }
}

