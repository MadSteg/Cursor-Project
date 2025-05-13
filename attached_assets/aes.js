const crypto = require('crypto');
const ALGO = 'aes-256-gcm';

function encryptJSON(obj) {
  const iv = crypto.randomBytes(12);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const data = Buffer.from(JSON.stringify(obj), 'utf8');
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted: Buffer.concat([iv, tag, encrypted]).toString('base64'),
    key: key.toString('hex'),
  };
}

module.exports = { encryptJSON };
