/* eslint-disable no-console */

const API_BASE = process.env.BACKEND_URL || 'http://localhost:5000';
const EMAIL = process.env.SMOKE_EMAIL || `smoke.${Date.now()}@example.com`;
const PASSWORD = process.env.SMOKE_PASSWORD || 'Test@123456';
const FULL_NAME = process.env.SMOKE_FULL_NAME || 'Smoke Tester';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function ensureUser() {
  const registerPayload = {
    fullName: FULL_NAME,
    email: EMAIL,
    password: PASSWORD,
  };

  const register = await requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerPayload),
  });

  if (!register.response.ok) {
    const registerMessage = String(register.body?.message || '').toLowerCase();
    const alreadyExists = registerMessage.includes('already') || register.response.status === 409;
    if (!alreadyExists) {
      throw new Error(`Register failed (${register.response.status}): ${register.body?.message || 'unknown'}`);
    }
    console.log(`Register skipped for existing user: ${EMAIL}`);
  } else {
    console.log(`Registered smoke user: ${EMAIL}`);
  }

  const login = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!login.response.ok) {
    throw new Error(`Login failed (${login.response.status}): ${login.body?.message || 'unknown'}`);
  }

  const token = login.body?.data?.accessToken;
  if (!token) {
    throw new Error('Login succeeded but access token is missing in response.');
  }

  return token;
}

async function hitEndpoint(name, path, token, options = {}) {
  const result = await requestJson(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!result.response.ok) {
    throw new Error(`${name} failed (${result.response.status}): ${result.body?.message || 'unknown'}`);
  }

  console.log(`PASS ${name}`);
  return result.body;
}

async function main() {
  console.log('Starting recommendations smoke test...');
  console.log(`Target API: ${API_BASE}`);

  const token = await ensureUser();

  const profilePayload = {
    skills: ['python', 'sql', 'machine learning'],
    interests: ['artificial intelligence', 'data science'],
    personality: ['analytical', 'collaborative'],
    education: 'bachelor',
    experience: 'fresher',
    workStyle: ['remote', 'team collaboration'],
    learningPreferences: ['hands-on projects'],
  };

  const bundle = await hitEndpoint(
    'POST /api/recommendations',
    '/api/recommendations',
    token,
    {
      method: 'POST',
      body: JSON.stringify(profilePayload),
    }
  );

  // POST endpoint triggers engine analysis and stores matches
  // Now verify the GET endpoints return the stored results
  const topCareerData = await hitEndpoint('GET /api/recommendations/top-career', '/api/recommendations/top-career', token);
  await hitEndpoint('GET /api/recommendations/roadmaps', '/api/recommendations/roadmaps', token);
  await hitEndpoint('GET /api/recommendations/skills', '/api/recommendations/skills', token);

  // Legacy compatibility endpoints
  await hitEndpoint('GET /api/recommendations/careers', '/api/recommendations/careers', token);
  await hitEndpoint('GET /api/recommendations/jobs', '/api/recommendations/jobs', token);

  const topCareer = topCareerData?.data?.career || topCareerData?.career || 'N/A';
  const matchCount = (bundle?.data?.careerMatches || bundle?.careerMatches || []).length;
  console.log(`Summary: topCareer=${topCareer}, matches=${matchCount}`);
  console.log('Recommendations smoke test completed successfully.');
}

main().catch((error) => {
  console.error('Smoke test failed:', error.message || error);
  process.exitCode = 1;
});
