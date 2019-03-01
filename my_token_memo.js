const StellarSdk = require('stellar-sdk')
const MyToken = require('./lib/token.js')
const config = require('./config.js').config

const asset = new StellarSdk.Asset(
  'OREORE',
  config.publicKey
);

const memo = (type) => {
  let obj = {}
  let value = ''
  switch (type) {
    case "text":
      value = 'おれおれトークン'
      obj = StellarSdk.Memo.text(value)
      break;
    case "hash":
      value = 'b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad'
      obj = StellarSdk.Memo.hash(value)
      break;
    case "id":
      value = '123456789'
      obj = StellarSdk.Memo.id(value)
      break;
    case "return":
      value = 'b36f330c6db84bef6ca34057c9739b88115565cf873fdb1350e481140a4429ad'
      obj = StellarSdk.Memo.return(value)
      break;
    default:
      obj = StellarSdk.Memo.none()
  }
  return obj
}
const memoObj = memo('text')
const obj = new MyToken()
obj.createTransaction(
  'GBY4J7D4ERYAVD2IXTIFS6SSSSG343LNF5B57F4BJL5IIEKGUBEBYC37',
  asset,
  100
).then((txBuild) => {
  txBuild.addMemo(memoObj)
  const tx = txBuild.build()
  obj.send(tx)
}).catch((ex) => console.error(ex))
