
import StellarSdk from 'stellar-sdk';

StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const issuingKeys = StellarSdk.Keypair.fromSecret('SAEHS4V4TCKTJBPCUWJYDFWGECEBH3RKRZ7JHFALGOJGUY34XM6QNK7X');
const receivingKeys = StellarSdk.Keypair.fromSecret('SBQEBVNICAHX6UPBH3IP4F4PYOUH5F22TLPEOTOGXLUXGKELF47LQDNA');

console.log(issuingKeys.publicKey(),receivingKeys.publicKey());

const jpyx = new StellarSdk.Asset('JPYX', issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey()).then((receiver) => {
  const transaction = new StellarSdk.TransactionBuilder(receiver)
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: jpyx,
      limit: "10000"
    }))
    .build();
  receiver.balances.some((balance) => {
    console.log(balance);
  })
  transaction.sign(receivingKeys);
  return server.submitTransaction(transaction);
})
  .then(() => {
    return server.loadAccount(issuingKeys.publicKey())
  })
  .then((issuer) => {
    const transaction = new StellarSdk.TransactionBuilder(issuer)
      .addOperation(StellarSdk.Operation.payment({
        destination: receivingKeys.publicKey(),
        asset: jpyx,
        amount: "10"
      }))
      .build();
    issuer.balances.some((balance) => {
      console.log(balance);
    })
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .catch((error) => {
    console.error('Stellar Error!!!')
    console.log(error.response.data.extras);
  });




abstracta
a
a
  















































































































































































