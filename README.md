# stellar-tutorial
This tutorial code is a sample of a series article ([Japanese only](https://crypto.watch.impress.co.jp/docs/serial/dmmcourse/1159808.html))this tutorial file 

For creating and sending custom asset(token).The original code is [official page](https://www.stellar.org/developers/js-stellar-base/reference/base-examples.html), but the orginal code is written in Promise/Then, unfortunately I can not see it. Therefore, I coded it with Await/Async.

## Operation check
* Node.js version: 8.9.0, 10.14.2(Operation check OK)
* OS version: Ubuntu, MacOSX(no check windows os)
* js-stellar-sdk version: 0.11.0

## Install

```bash
$ npm install
```

## Pre-work
Rewrite config.js

```json
exports.config = {
  publicKey: 'Your public key',
  secretKey: 'Your secret key',
}
```
and 

## Usage

```bash
node my_token.js
```

* Issue custom asset
```js
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
```
