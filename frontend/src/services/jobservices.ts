import { apiFetch } from './api';

export type JobFeedItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string | null;
  skills: string[];
  applyLink: string;
  source: string;
  createdAt: string;
  matchScore: number;
  applied: boolean;
  appliedAt?: string | null;
};

export type JobFeed = {
  recentJobs: JobFeedItem[];
  recommendedJobs: JobFeedItem[];
  appliedJobs: JobFeedItem[];
};

type JobsResponse = {
  success: boolean;
  message: string;
  data: JobFeed;
};

type SyncJobsResponse = {
  success: boolean;
  message: string;
  data: {
    totalFetched: number;
    totalStored: number;
    jobs: JobFeedItem[];
  };
};

export async function fetchJobs() {
  const response = await apiFetch<JobsResponse>('/api/jobs', undefined, { auth: true });
  return response.data;
}

export async function applyForJob(jobId: string) {
  const response = await apiFetch<{ data: JobFeedItem }>(`/api/jobs/${jobId}/apply`, {
    method: 'POST',
  }, { auth: true });

  return response.data;
}

export async function storeJobs() {
  const response = await apiFetch<SyncJobsResponse>('/api/jobs/sync', { method: 'POST' });

  return response.data;
}