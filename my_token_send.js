const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'OREORE',
  config.publicKey
);

const obj = new MyToken()
obj.createTransaction(
  'GCV24G6G7WYZDSYQHK7C3MDGJPQD7R6FBP7SGKSZE2FNQSW4SRZXXSIJ',
  asset,
  100
).then((txBuild) => {
  const tx = txBuild.build()
  obj.send(tx)
}).catch((ex) => console.error(ex))
