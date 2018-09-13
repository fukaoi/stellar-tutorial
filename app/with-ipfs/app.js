import ipfsAPI from 'ipfs-api'

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

