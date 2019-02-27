const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'AAA',
  config.publicKey
);

const obj = new MyToken(asset)
obj.send(100)
