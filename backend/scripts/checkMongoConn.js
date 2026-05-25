require('dotenv').config();
const dns = require('dns');
const { MongoClient } = require('mongodb');

// Force public DNS servers for SRV resolution to avoid local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.DATABASE_URL;
console.log('Using DATABASE_URL:', uri ? uri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, '$1:***@') : '(none)');
console.log('DNS servers in use:', dns.getServers());

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB driver');
    const res = await client.db().command({ ping: 1 });
    console.log('Ping result:', res);
  } catch (err) {
    console.error('Connection error:');
    console.error(err);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch (_) {}
  }
})();
