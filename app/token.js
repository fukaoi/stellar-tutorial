import StellarSdk from 'stellar-sdk';

StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const issuingKeys = StellarSdk.Keypair.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
const receivingKeys = StellarSdk.Keypair.fromSecret('SDSAVCRE5JRAI7UFAVLE5IMIZRD6N6WOJUWKY4GFN34LOBEEUS4W2T2D');

console.log(issuingKeys.publicKey(),receivingKeys.publicKey());

const jpyx = new StellarSdk.Asset('JPYX', issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey()).then((receiver) => {
  const transaction = new StellarSdk.TransactionBuilder(receiver)
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: jpyx,
      limit: "10000"
    }))
    .build();
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
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .catch((error) => {
    console.error('Stellar Error!!!')
    console.log(error.response.data.extras);
  });

