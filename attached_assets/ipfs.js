const ipfsClient = require('ipfs-http-client');
require('dotenv').config();

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// For v39.0.2, we create the client differently
const client = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: projectId ? { authorization: auth } : undefined,
});

async function pinJSON(content) {
  // In v39.0.2, the add method has different behavior
  const result = await client.add(Buffer.from(JSON.stringify(content)));
  return result.path || result.cid.toString();
}

module.exports = { pinJSON };
