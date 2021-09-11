import {
  Keypair,
  Server,
  TransactionBuilder,
  Networks,
  Operation,
} from "stellar-sdk";

const source = {
  pubkey: "GDET6XH7VPFIBVWM45TS6TPJZ5LX2ODUQM6CBOWVA56WJNJFANOQJVBB",
  secret: "SDE5XQ2XHF3XO4T7PESUOMWMELWYDEX3FG4XJ2SJQAB6GNM3KKIDT5BV",
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
    pubkey: "GBN5VG73IIDEDNI22CXZFCT7I6K5IAATVNJVLCQ24BIPRCQ5GM2ZIT3T",
    secret: "SA7A4G7C7X4ROTHPSDKFM5W7XADNQQBK7OAXWAYNUNJJFF5LUUHPTGNP",
  },
  {
    pubkey: "GAT6KZQ4S4KWOFTCU5E2TWHQSXSPAR67CQIMAX3XFBTI6DBBQ6UPZ4NJ",
    secret: "SDVXLJCKQDINWPEG3VNPJJTDKGB7Y2KAOWEAHFKRMGTELLGQDWHPHUU3",
  },
  {
    pubkey: "GDL7YYX337MFJ6CGDWJWUEIIKXXZAOR4HM2AZ2CLIV3IIHCMLRDSKU26",
    secret: "SCMHF343ZB52YONPFIL2U3ODO3XPUCMFVQXDBE42533LJRY2XRV3EMJ3",
  },
];

const exec = async (index) => {
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
