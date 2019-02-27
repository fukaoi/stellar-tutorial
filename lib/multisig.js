const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config
const configSec = require('../config.js').configSec

module.exports = class Multisig {
  //
  // Initialize
  //
  constructor(
    assetObject = StellarSdk.Asset.native(),
  ) {
    StellarSdk.Network.useTestNetwork()
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
    this.keypairSec = StellarSdk.Keypair.fromSecret(configSec.secretKey);
    this.destination = 'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37'
    this.assetObject = assetObject
  }


  //
  // Create Secondary signature
  //
  createSecondarySignature(accountObject) {
    const configSec = {
      signer: {
        ed25519PublicKey: this.keypairSec.publicKey(),
        weight: 1
      }
    }

    const config = {
      masterWeight: 1,
      lowThreshold: 1,
      medThreshold: 1,
      highThreshold:1
    }

    const operationSec = () => {
      return StellarSdk.Operation.setOptions(configSec)
    }

    const operation = () => {
      return StellarSdk.Operation.setOptions(config)
    }
    const tx = new StellarSdk.TransactionBuilder(accountObject)
      .addOperation(operationSec())
      .addOperation(operation())
      .build()
    return tx
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
      .build()
    return tx
  }

  //
  // Main method
  //
  async send(amount) {
    try {
      const account = await this.server.loadAccount(this.keypair.publicKey());
      // const transactionSig = this.createSecondarySignature(account)
      // transactionSig.sign(this.keypair);
      // await this.server.submitTransaction(transactionSig);

      const transaction = this.createTransaction(account, this.destination, amount);
      transaction.sign(this.keypair);
      transaction.sign(this.keypairSec);
      await this.server.submitTransaction(transaction);
      console.log('Send success!!');
    } catch (error) {
      console.error(error)
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

