const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const nonce = crypto.randomBytes(16)

const attachment = {
  "nonce": nonce.toString('hex'),
  "transaction": {
    "sender_info": {
      "name": "Oi Fuka",
      "address": "10B Aoyama Street",
      "city": "Tokyo",
      "country": "Japan"
    }
  },
  "operations": [{}]
}

hash.update(JSON.stringify(attachment))
let memoHashHex = hash.digest('hex')

console.log(memoHashHex)
