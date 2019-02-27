const StellarSdk = require('stellar-sdk')
const MyAuth = require('./lib/authorize.js')
const config = require('./config.js').config

if (!process.argv[2]) {
  console.error('Input destination public key')
  return
}

if (process.argv[3] != 'true' && process.argv[3] != 'false') {
  console.error('Input authorize true or false')
  return
}


const auth = new MyAuth(process.argv[2])
auth.run("AAA", process.argv[3])
