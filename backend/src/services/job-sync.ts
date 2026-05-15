import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { config } from '@/config/env';

interface RapidApiJob {
  job_title?: string;
  employer_name?: string;
  job_city?: string;
  job_description?: string;
  job_salary?: string;
  job_apply_link?: string;
}

export interface StoredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string | null;
  skills: string[];
  applyLink: string;
  source: string;
  createdAt: Date;
}

async function fetchRapidApiJobs(): Promise<RapidApiJob[]> {
  if (!config.rapidApi.key) {
    throw new Error('RAPID_API_KEY is not configured');
  }

  const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
    params: {
      query: 'software developer jobs',
      page: '1',
      num_pages: '1',
    },
    headers: {
      'X-RapidAPI-Key': config.rapidApi.key,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });

  return Array.isArray(response.data?.data) ? response.data.data : [];
}

function normalizeSkillText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#./ ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJobSkills(
  title: string,
  description: string,
  availableSkills: string[]
): string[] {
  const haystack = normalizeSkillText(`${title} ${description}`);

  return Array.from(
    new Set(
      availableSkills
        .filter(Boolean)
        .sort((left, right) => right.length - left.length)
        .filter((skill) => {
          const normalizedSkill = normalizeSkillText(skill);
          return normalizedSkill.length > 1 && haystack.includes(normalizedSkill);
        })
    )
  );
}

export async function storeJobs() {
  const jobs = await fetchRapidApiJobs();
  const skillRecords = await prisma.skill.findMany({
    select: { skillName: true },
  });
  const availableSkills = skillRecords.map((skill) => skill.skillName);

  await prisma.job.deleteMany({
    where: { source: 'JSearch' },
  });

  const createdJobs: StoredJob[] = [];

  for (const job of jobs) {
    const createdJob = await prisma.job.create({
      data: {
        title: job.job_title || 'Unknown',
        company: job.employer_name || 'Unknown',
        location: job.job_city || 'Remote',
        description: job.job_description || '',
        salary: job.job_salary || '',
        skills: extractJobSkills(
          job.job_title || 'Unknown',
          job.job_description || '',
          availableSkills
        ),
        applyLink: job.job_apply_link || '',
        source: 'JSearch',
      },
    });

    createdJobs.push(createdJob);
  }

  return {
    totalFetched: jobs.length,
    totalStored: createdJobs.length,
    jobs: createdJobs,
  };
}

export async function getStoredJobs() {
  return prisma.job.findMany({
    where: { source: 'JSearch' },
    orderBy: { createdAt: 'desc' },
  });
}