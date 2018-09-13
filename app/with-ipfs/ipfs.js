import ipfsAPI from 'ipfs-api'
import StellarSdk from 'stellar-sdk'
import bs58 from 'bs58'

// ### Public Key
// GCEFFCCJU3YWN4V5DMB453BMQ4USROPBMV63LQKZQLTD5F67TDUBAEVB
// ### Secret Key	
// SAEVDNLEOP425FGOT6MTSZYJ4BVQ2NKGFLE5DM6CMF3A4MZB6SHZM3ZT

const ipfs = ipfsAPI({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

const post = JSON.stringify({
  title: "So exited!!!",
  content: 'This is my first post',
  username: 'h4ck3r'
});

const buffer = Buffer.from(post);

ipfs.files.add(buffer, { pin: false }, (err, ipfsHash) => {
  console.log(ipfsHash[0].path);
});

this.getBytes32FromIpfsHash = (ipfsListing) => {
  return bs58.decode(ipfsListing).slice(2).toString('hex')  
}

this.submitPost = (post) => {
  const buffer = Buffer.from(post);
  ipfs.files.add(buffer, (ipfsHash) => {
    this.txMemo = this.getBytes32FromIpfsHash(ipfsHash[0].path)
    this.refs['savePost'].click();
    this.confirmPayment(this.txMemo)
  });
}

this.confirmPayment = (ipfsHash) => {
  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org'); 
  server.transactions().forAccount('GCEFFCCJU3YWN4V5DMB453BMQ4USROPBMV63LQKZQLTD5F67TDUBAEVB').cursor('now').stream({
    onmessage: (transaction) => {
      if (transaction.memo == ipfsHash) {
        transaction.operations().then((ops) => {
          let payment = ops._embedded.records[0];
          if (parseInt(parseFloat(payment.amount) < 1)) {
            console.error('Payment insufficient. Post not saved!');
          } else {
            this.pinIpfsListing(ipfsHash);
          }
        }).catch((error) => {
          error.target.close();
          console.error('Payment error:', error);
          alert('Error confirming payment');
        });
      }
    },
    onerror: (error) => {
      error.target.close();
      console.error('Streaming Error:', error);
    }
  });
}
