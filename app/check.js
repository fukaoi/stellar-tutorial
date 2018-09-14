import StellarSdk from 'stellar-sdk'

StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const code = 'JPYX';
const issuer = 'GA6SZLRZTUPZTOKHKCGY6VFIFVEGPJB2PY6DFSAUAX4T2SNTFVJC4KF4';
const receiver = 'GD53XJI3C7W4TZBXH3TFKD7YJQXZLX2BYNOM47COPV47AZAZIDTLQJMO';

server.loadAccount(receiver).then((account) => {
  account.balances.some((balanace) => {
    if (balanace.asset_code == code) {
      console.log(balanace.asset_code);
      console.log(balanace.asset_issuer);
      console.log(balanace.balance);  
    }
  });
});
