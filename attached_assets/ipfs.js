const { create } = require('ipfs-http-client');
require('dotenv').config();

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: projectId ? { authorization: auth } : undefined,
});

async function pinJSON(content) {
  const { cid } = await client.add({ content });
  return cid.toString();
}

module.exports = { pinJSON };
