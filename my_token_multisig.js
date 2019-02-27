const StellarSdk = require('stellar-sdk')
const MyMultisig = require('./lib/multisig.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'AAA',
  config.publicKey
);

const obj = new MyMultisig(asset)
obj.send(100)
