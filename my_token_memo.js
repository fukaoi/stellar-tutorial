const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'OREORE',
  config.publicKey
);

const memo = (type, value) => {
  let obj = {}
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
const memo = memo("text", "おれおれトークン")
// const memoObj = memo("hash", "b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad")
// const memoObj = memo("id", "123456789")
// const memoObj = memo("return", "b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad")
const obj = new MyToken(asset)
obj.send(100)
