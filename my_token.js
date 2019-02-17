const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'OREORE',
  config.publicKey
);

const memo = (type, value) => {
  obj = {}
  switch (type) {
    case "text":
      obj = StellarSdk.Memo.text(value)
      break;
    case "hash":
      obj = StellarSdk.Memo.hash(value)
      break;
    case "id":
      obj = StellarSdk.Memo.id(value)
      break;
    case "return":
      obj = StellarSdk.Memo.return(value)
      break;
    default:
      obj = StellarSdk.Memo.none()
  }
  return obj
}

const obj = new MyToken(asset)
obj.send(100)
