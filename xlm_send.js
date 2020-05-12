const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  StellarSdk.Asset.native(),
  config.publicKey
);

const obj = new MyToken()
obj.createTransaction(
  config.destPublicKey, 
  '', 
  1
).then((txBuild) => {
  const tx = txBuild.build()
  obj.send(tx)
}).catch((ex) => console.error(ex))
