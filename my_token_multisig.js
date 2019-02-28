const StellarSdk = require('stellar-sdk')
const MyMultisig = require('./lib/multisig.js')
const config = require('./config.js').config

const obj = new MyMultisig()
obj.create()
