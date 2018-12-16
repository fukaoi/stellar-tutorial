const StellarSdk = require('stellar-sdk')
const config = require('./config.js').xlm

class SendXlmToken {
  //
  // Initialize
  //
  constructor() {
    StellarSdk.Network.useTestNetwork()
    this.server      = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    this.publicKey   = config.publicKey
    this.secretKey   = config.secretKey
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
  // check balance, asset code, asset issure
  //
  async checks() {
    try {
      const account = await this.server.loadAccount(this.publicKey);
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

const obj = new SendXlmToken()
obj.checks()  
obj.main(1)