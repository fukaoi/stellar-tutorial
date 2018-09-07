let StellarSDK = require('stellar-sdk')
StellarSDK.Network.useTestNetwork();

let server = new StellarSDK.Server('https://horizon-testnet.stellar.org');
let sourceKeys = StellarSDK.Keypair.fromSecret('');
let destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

var transaction;

server.loadAccount(destinationId)

