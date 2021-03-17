const StellarSdk = require('stellar-sdk');
const sourceSecretKey = 'SCXZ7AG65KYBTRXBEVUSCGITFXGD5FABHJHM4EMWRABFSPLDOMWLINQO';
const receiverPublicKey = 'GC4NFLYYNJZ7JEFJ4NO3EB7IWIXYMCGW4T2THZIFN6XS6KEWI4QW46LT';
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

(async function main() {
  const account = await server.loadAccount(sourcePublicKey);
  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: receiverPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: '350.1234567',
    }))
    .setTimeout(30)
    .build();
  transaction.sign(sourceKeypair);

  try {
    const transactionResult = await server.submitTransaction(transaction);
    console.log(transactionResult._links.transaction.href);
  } catch (e) {
    console.log('An error has occured:');
    console.log(e);
  }
})();
