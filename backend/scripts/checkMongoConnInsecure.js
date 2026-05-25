require('dotenv').config();
const dns = require('dns');
const { MongoClient } = require('mongodb');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const uri = process.env.DATABASE_URL;
console.log('Using DATABASE_URL masked:', uri ? uri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, '$1:***@') : '(none)');
console.log('DNS servers:', dns.getServers());

const opts = {
  serverSelectionTimeoutMS: 10000,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
};

(async () => {
  const client = new MongoClient(uri, opts);
  try {
    await client.connect();
    console.log('Connected with relaxed TLS options');
    const res = await client.db().command({ ping: 1 });
    console.log('Ping result:', res);
  } catch (err) {
    console.error('Insecure connection error:');
    console.error(err);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch (_) {}
  }
})();
