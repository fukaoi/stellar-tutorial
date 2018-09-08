import StellarSdk from 'stellar-sdk'

StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
// 'GC2BKLYOOYPDEFJKLKY6FNNRQMGFLVHJKQRGNSSRRGSMPGF32LHCQVGF'
const sourceKeys = StellarSdk.Keypair
.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
const destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';
let transaction;
const jpyx = new StellarSdk.Asset('JPYX', sourceKeys.publicKey());

server.loadAccount(destinationId).catch(StellarSdk.NotFoundError, (error) => {
  throw new Error('The destination account does not exist!');
})

  .then(() => { return server.loadAccount(sourceKeys.publicKey())})
  .then((sourceAccount) => {
    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        // asset: jpyx,
        asset: StellarSdk.Asset.native(),
        amount: '0.001'
      }))
      .addMemo(StellarSdk.Memo.text('Test Transaction')).build();
    
    transaction.sign(sourceKeys);
    return server.submitTransaction(transaction);
  }) 
  .then((result) => {
    console.log('Success result', result);
  })
  .catch((error) => {
    console.error('Error!', error);
  })
