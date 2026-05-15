const { MongoClient } = require('mongodb');

const url = process.argv[2] || 'mongodb://localhost:27018';
const replId = process.argv[3] || 'rs0';

(async () => {
  const client = new MongoClient(url);
  try {
    console.log(`Connecting to ${url}...`);
    await client.connect();
    const adminDb = client.db().admin();

    // Check if a repl set is already initiated
    try {
      const status = await adminDb.command({ replSetGetStatus: 1 });
      if (status && status.ok) {
        console.log('Replica set already initiated:', status);
        return process.exit(0);
      }
    } catch (e) {
      // replSetGetStatus will throw if not initiated; continue to initiate
    }

    console.log('Initiating replica set...');

    // Try a few hostnames that are commonly correct depending on how mongod is exposed
    const memberHosts = [
      'localhost:27017',
      '127.0.0.1:27017',
      'localhost:27018',
      '127.0.0.1:27018'
    ];

    let initiated = false;
    for (const host of memberHosts) {
      const config = { _id: replId, members: [{ _id: 0, host }] };
      try {
        const res = await adminDb.command({ replSetInitiate: config });
        console.log('replSetInitiate result for', host, ':', res);
        initiated = true;
        break;
      } catch (err) {
        console.warn(`replSetInitiate failed for ${host}:`, err.message || err);
      }
    }

    if (!initiated) {
      console.error('Failed to initiate replica set. Please ensure MongoDB is running and accessible, and run this script with the correct connection string.');
      process.exit(2);
    }

    // Wait a bit and print status
    await new Promise((r) => setTimeout(r, 2000));
    const status = await adminDb.command({ replSetGetStatus: 1 }).catch(() => null);
    console.log('Final repl status:', status);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch (_) {}
  }
})();
