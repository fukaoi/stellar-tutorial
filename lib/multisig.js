const StellarSdk = require('stellar-sdk')
const config = require('../config.js').config
const configSec = require('../config.js').configSec

module.exports = class Multisig {
  //
  // Initialize
  //
  constructor(
  ) {
    StellarSdk.Network.useTestNetwork()
    this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.keypair = StellarSdk.Keypair.fromSecret(config.secretKey);
    this.keypairSec = StellarSdk.Keypair.fromSecret(configSec.secretKey);
  }


  //
  // Create Secondary signature
  //
  createSignature(accountObject) {
    const configSig = {
      signer: {
        ed25519PublicKey: this.keypairSec.publicKey(),
        weight: 1
      }
    }

    const configThreshold = {
      masterWeight: 1,
      lowThreshold: 1,
      medThreshold: 2,
      highThreshold:1
    }

    const operationSig = () => {
      return StellarSdk.Operation.setOptions(configSig)
    }

    const operation = () => {
      return StellarSdk.Operation.setOptions(configThreshold)
    }
    const tx = new StellarSdk.TransactionBuilder(accountObject)
      .addOperation(operationSig())
      .addOperation(operation())
      .build()
    return tx
  }

  //
  // Main method
  //
  async create() {
    try {
      const account = await this.server.loadAccount(this.keypair.publicKey());
      const transactionSig = this.createSignature(account)
      transactionSig.sign(this.keypair);
      await this.server.submitTransaction(transactionSig);

      console.log('Create multi sig success!!');
    } catch (error) {
      const err = error.response
      if (err == undefined) {
        console.error(error)
      } else if (err.data == undefined) {
        console.error(err)
      } else {
        const result = err.data.extras.result_codes
        if (result.operations.includes('op_success')) {
          console.error('Exists multisig settings!!') 
        } else {
          console.error(result)
        }
      }
    }
  }
}

