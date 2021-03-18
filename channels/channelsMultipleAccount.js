const {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
} = require("stellar-sdk");

const source = {
  pubkey: "GCGESL6O7LEZHYBU6HVNXIA6G6WA3XXS7PK5FCBSLANBZQ23KLWAV5QR",
  secret: "SCXZ7AG65KYBTRXBEVUSCGITFXGD5FABHJHM4EMWRABFSPLDOMWLINQO",
};

const server = new Server("https://horizon-testnet.stellar.org");

const channels = [
  {
    pubkey: "GB3AE73N2XOIRX6WEAJPBFPU5U6ZKWTENJT3EPRBTLKNPRYPKXFHD5XF",
    secret: "SBFEITRASIXHT3WNPNHXQ5UJW34VPAAL3NFFJ545UNNCPRP2BRGVVQLO",
  },
  {
    pubkey: "GDUII64BI5JVFP54TR5ISA4CENMYFR37NTGMUAZW3U72NPDLCURWDNBS",
    secret: "SCFBHP3RAN5QBMB3ZHWBHNLWIGZ77MX775757GDPVDJ6G3WINRBFCNT4",
  },
  {
    pubkey: "GCXG7QQLAKSSTR7KET44PSQPZBGYPC7X4N65HWLTNBXEZOBK42JL3WVC",
    secret: "SAPA6DQ52ZW7E6OMJPDP65WHBVLX2GOEBUPCCYNETSZKPE5ZRRIU3N6J",
  },
  {
    pubkey: "GB2JYXODDOGMAU4NQJTTPAQTWUWGOK6GHBH6I542VPIECKJTVOAG7NEY",
    secret: "SBKIRJRB3MPD2ZXOHCV3QY5C3IEZDG63B4BITJRPYFQ7TUHZUIFSJJ7G",
  },
  {
    pubkey: "GCIA6UA3UDDHXZ3TVRK4D7XKOQAUE6QOJB242YQPWFL3SPTFEOMHH2MR",
    secret: "SAAXQFEX4ZR73A4NOE2U76NTQPDCFVUAADFZZELMWPHZDPS3RMCFA2WJ",
  },
];

const index = Math.floor(Math.random() * channels.length);

(async () => {
  const newPubKey = Keypair.random().publicKey();
  const channel = channels[index];
  const channelAccount = await server.loadAccount(channel.pubkey);
  const transaction = new TransactionBuilder(channelAccount, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.createAccount({
        source: source.pubkey,
        destination: newPubKey,
        startingBalance: "20",
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(Keypair.fromSecret(channel.secret));
  transaction.sign(Keypair.fromSecret(source.secret));

  try {
    const res = await server.submitTransaction(transaction);
    console.log(res._links.transaction.href);
  } catch (err) {
    console.error(err.response.data.extras.result_codes);
  }
})();
