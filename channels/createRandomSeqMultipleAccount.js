const {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
} = require("stellar-sdk");

const source = {
  pubkey: "GDET6XH7VPFIBVWM45TS6TPJZ5LX2ODUQM6CBOWVA56WJNJFANOQJVBB",
  secret: "SDE5XQ2XHF3XO4T7PESUOMWMELWYDEX3FG4XJ2SJQAB6GNM3KKIDT5BV",
};

const server = new Server("https://horizon-testnet.stellar.org");

const exec = async (increment) => {
  const newPubKey = Keypair.random().publicKey();
  const sourceAccount = await server.loadAccount(source.pubkey);
  for (let i = 0; i < increment; i++) {
    sourceAccount.incrementSequenceNumber();
  }
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: await server.fetchBaseFee() * 2,
    networkPassphrase: Networks.TESTNET, 
  })
    .addOperation(
      Operation.createAccount({
        destination: newPubKey,
        startingBalance: "2",
      })
    )
    .setTimeout(60)
    .build();

  console.log(`next current number: ${sourceAccount.sequence}, increment: ${increment}`);
  transaction.sign(Keypair.fromSecret(source.secret));

  try {
    const res = await server.submitTransaction(transaction);
    console.log(res._links.transaction.href);
  } catch (err) {
    console.error(err.response.data.extras.result_codes);
  }
};

(() => {
  exec(0);
  exec(1);
  exec(2);
  exec(3);
  exec(4);
  exec(5);
  exec(6);
})();
