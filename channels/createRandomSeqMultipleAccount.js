const {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
  Account,
} = require("stellar-sdk");

const source = {
  pubkey: "GDET6XH7VPFIBVWM45TS6TPJZ5LX2ODUQM6CBOWVA56WJNJFANOQJVBB",
  secret: "SDE5XQ2XHF3XO4T7PESUOMWMELWYDEX3FG4XJ2SJQAB6GNM3KKIDT5BV",
};

const server = new Server("https://horizon-testnet.stellar.org");
const index = Math.floor(Math.random() * 100).toString();
 
(async () => {
  const newPubKey = Keypair.random().publicKey();
  const sourceAccount = await server.loadAccount(source.pubkey);
  const account = new Account(source.pubkey, index);
  console.log(`${account.sequenceNumber()}`);
  account.incrementSequenceNumber();
  console.log(`incremented: ${account.sequenceNumber()}`);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.createAccount({
        destination: newPubKey,
        startingBalance: "20",
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(Keypair.fromSecret(source.secret));

  try {
    const res = await server.submitTransaction(transaction);
    console.log(res._links.transaction.href);
  } catch (err) {
    console.error(err.response.data.extras.result_codes);
  }
})();
