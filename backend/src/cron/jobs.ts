import cron from 'node-cron';

import { storeJobs } from '../services/jobService';

cron.schedule(
  '*/10 * * * *',
  async () => {
    console.log('Fetching latest jobs...');

    try {
      await storeJobs();
    } catch (error) {
      console.error('Failed to sync jobs from cron:', error);
    }
  }
);