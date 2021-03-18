const StellarSdk = require("stellar-sdk");
const StellarBase = require("stellar-base");

const sourceSecretKey =
  "SCXZ7AG65KYBTRXBEVUSCGITFXGD5FABHJHM4EMWRABFSPLDOMWLINQO";
const receiverPublicKey =
  "GC4NFLYYNJZ7JEFJ4NO3EB7IWIXYMCGW4T2THZIFN6XS6KEWI4QW46LT";
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

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
  {
    pubkey: "GDADGHXRUBKBIGLHIWP6TL4RNP7NA4WBYNTRYYVKW4FV4FVI6R6VK6U4",
    secret: "SB4QMKZXBTQO6C7EWJWP3PMK3UPOKCRFKFCH4VUESNNLWXH742LTAHCJ",
  },
  {
    pubkey: "GCGESL6O7LEZHYBU6HVNXIA6G6WA3XXS7PK5FCBSLANBZQ23KLWAV5QR",
    secret: "SB6GJ75LXWYG6ZWKCLSWBIUEKORPH3UASLBT74VILPWIDLTXWPBEN3O4",
  },
];

async function exec() {
  const keypair = StellarBase.Keypair.random();
  const pubkey = keypair.publicKey();
  // const account = await server.loadAccount(sourcePublicKey);
  const index = Math.floor(Math.random() * (channels.length));
  const channel = channels[index];
  console.log(channel);
  const account = await server.loadAccount(channel.pubkey);
  const fee = await server.fetchBaseFee();
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: pubkey,
        startingBalance: "10",
      })
    )
    .setTimeout(30)
    .build();
  // transaction.sign(sourceKeypair);
  const channelKeypair = StellarSdk.Keypair.fromSecret(channel.secret);
  transaction.sign(channelKeypair);

  try {
    const transactionResult = await server.submitTransaction(transaction);
    console.log(transactionResult._links.transaction.href);
  } catch (error) {
    const err = error.response;
    if (err == undefined) {
      console.error(error);
    } else if (err.data == undefined) {
      console.error(err);
    } else {
      console.error(err.data.extras.result_codes);
    }
  }
}

// const main = async () => {
const main = () => {
  exec();
  // await exec();
};

main();
