const StellarSdk = require('stellar-sdk')
const MyAuth = require('./lib/authorize.js')
const config = require('./config.js').config

const auth = new MyAuth()
auth.run("OREORE25")
