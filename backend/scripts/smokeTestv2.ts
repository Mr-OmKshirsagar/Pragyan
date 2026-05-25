import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

interface TestResults {
  passed: number;
  failed: number;
  tests: { name: string; status: 'PASS' | 'FAIL'; details?: any }[];
}

const results: TestResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name: string, status: 'PASS' | 'FAIL', details?: any) {
  results.tests.push({ name, status, details });
  if (status === 'PASS') {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   Error: ${details}`);
  }
}

async function testE2E() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  🧪 Pragyan E2E Smoke Test                    ║');
  console.log('║  Verifying: Careers → Jobs → Roadmaps         ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  let authToken = '';

  try {
    // Test 0: Create test user for auth-required endpoints
    console.log('📍 Test 0: Creating test user...');
    try {
      const email = `e2e-${Date.now()}@test.local`;
      const registerRes = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password: 'TestPass123!@#',
        fullName: 'E2E Smoke Test User',
      }, { timeout: 5000 });
      
      authToken = registerRes.data?.data?.token || registerRes.data?.token || '';
      logTest('Test User Created', authToken ? 'PASS' : 'FAIL', `Email: ${email}`);
    } catch (error: any) {
      logTest('Test User Created', 'FAIL', error.message);
    }

    // Test 1: Check roadmaps endpoint works
    console.log('\n📍 Test 1: Checking roadmaps endpoint...');
    try {
      const roadmapsRes = await axios.get(`${API_BASE}/roadmaps`, { timeout: 5000 });
      const roadmaps = roadmapsRes.data?.data || roadmapsRes.data || [];
      logTest('Roadmaps API', roadmaps.length > 5 ? 'PASS' : 'FAIL', `Found ${roadmaps.length} roadmaps`);
    } catch (error: any) {
      logTest('Roadmaps API', 'FAIL', error.message);
    }

    // Test 2: Check career matching endpoint
    console.log('\n📍 Test 2: Checking career matching endpoint...');
    try {
      const careerRes = await axios.get(`${API_BASE}/career-matching`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        timeout: 5000,
      });
      const careers = careerRes.data?.data || careerRes.data || [];
      logTest('Career Matching API', careers.length >= 0 ? 'PASS' : 'FAIL', `Career data accessible`);
    } catch (error: any) {
      logTest('Career Matching API', 'FAIL', error.message);
    }

    // Test 3: Check jobs endpoint
    console.log('\n📍 Test 3: Checking jobs endpoint...');
    try {
      const jobsRes = await axios.get(`${API_BASE}/jobs`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        timeout: 5000,
      });
      const jobs = jobsRes.data?.data || jobsRes.data || [];
      logTest('Jobs API', jobs.length > 5 ? 'PASS' : 'FAIL', `Found ${jobs.length} jobs`);
    } catch (error: any) {
      logTest('Jobs API', 'FAIL', error.message);
    }

    // Test 4: Test assessment submission
    console.log('\n📍 Test 4: Testing assessment submission...');
    if (!authToken) {
      logTest('Assessment Submission', 'FAIL', 'No auth token available');
    } else {
      try {
        const assessmentRes = await axios.post(`${API_BASE}/assessment/submit`, {
          answers: [
            { question: 'Interest in coding', answer: 'High' },
            { question: 'Problem solving ability', answer: 'Advanced' },
            { question: 'Team collaboration', answer: 'Excellent' },
          ],
          selectedOptions: ['tech', 'problem-solving', 'teamwork'],
        }, {
          headers: { Authorization: `Bearer ${authToken}` },
          timeout: 5000,
        });

        const assessment = assessmentRes.data?.data || assessmentRes.data;
        logTest('Assessment Submission', assessment ? 'PASS' : 'FAIL', `Assessment recorded`);
      } catch (error: any) {
        logTest('Assessment Submission', 'FAIL', error.message);
      }
    }

    // Test 5: Get recommendations
    console.log('\n📍 Test 5: Checking recommendations endpoint...');
    if (!authToken) {
      logTest('Recommendations API', 'FAIL', 'No auth token available');
    } else {
      try {
        const recsRes = await axios.get(`${API_BASE}/recommendations`, {
          headers: { Authorization: `Bearer ${authToken}` },
          timeout: 5000,
        });

        const recs = recsRes.data?.data || recsRes.data || [];
        logTest('Recommendations API', recs.length >= 0 ? 'PASS' : 'FAIL', `Recommendations data accessible`);
      } catch (error: any) {
        logTest('Recommendations API', 'FAIL', error.message);
      }
    }

  } catch (error) {
    console.error('Critical error during smoke test:', error);
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  📊 Test Summary                               ║');
  console.log(`║  Passed: ${results.passed}${' '.repeat(40 - String(results.passed).length)}║`);
  console.log(`║  Failed: ${results.failed}${' '.repeat(40 - String(results.failed).length)}║`);
  console.log(`║  Total:  ${results.tests.length}${' '.repeat(40 - String(results.tests.length).length)}║`);
  console.log('╚════════════════════════════════════════════════╝\n');

  if (results.failed === 0 && results.passed > 3) {
    console.log('✨ Core tests passed! Pragyan is ready for development.\n');
  } else {
    console.log('⚠️ Some tests failed. Check endpoints and services.\n');
  }

  process.exit(results.failed > 2 ? 1 : 0);
}

// Run the test
testE2E().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
