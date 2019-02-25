const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config

module.exports = class Token {
  //
  // Initialize
  //
  constructor(
    assetObject = StellarSdk.Asset.native(),
    memoObject = StellarSdk.Memo.none()
  ) {
    StellarSdk.Network.useTestNetwork()
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
    this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'
    this.assetObject = assetObject
    this.memoObject = memoObject
  }

  //
  // Create transaction function
  //
  createTransaction(accountObject, destination, amount) {
    const config = {
      destination: destination,
      asset: this.assetObject,
      amount: String(amount),
    }

    const operation = () => {
      return StellarSdk.Operation.payment(config)
    }
    const tx = new StellarSdk.TransactionBuilder(accountObject)
      .addOperation(operation())
      .addMemo(this.memoObject)
      .build()
    return tx
  }

  //
  // check balance, asset code, asset issure
  //
  async check() {
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
      const err = error.response
      if (err.data == undefined) {
        console.error(err)
      } else {
        console.error(err.data.extras.result_codes)
      }
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

