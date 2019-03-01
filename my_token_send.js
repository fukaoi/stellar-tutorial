const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'OREORE',
  config.publicKey
);

const obj = new MyToken()
obj.createTransaction(
  'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37',
  asset,
  100
).then((txBuild) => {
  const tx = txBuild.build()
  obj.send(tx)
}).catch((ex) => console.error(ex))
