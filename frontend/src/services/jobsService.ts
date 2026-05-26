import { apiClient } from "./apiClient";
import type { JobFeed } from "@/types/api";

export const jobsService = {
  getJobs() {
    return apiClient.get<JobFeed>("/jobs");
  },

  applyToJob(jobId: string) {
    return apiClient.post(`/jobs/${jobId}/apply`, {});
  },
};