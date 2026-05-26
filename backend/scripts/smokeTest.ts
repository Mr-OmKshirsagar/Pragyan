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

  try {
    // Test 1: Check if careers API endpoint works
    console.log('📍 Test 1: Checking careers endpoint...');
    try {
      const careersRes = await axios.get(`${API_BASE}/careers`, { timeout: 5000 });
      const careers = careersRes.data?.data || careersRes.data;
      logTest('Careers API', careers && careers.length > 0 ? 'PASS' : 'FAIL', `Found ${careers?.length || 0} careers`);
    } catch (error: any) {
      logTest('Careers API', 'FAIL', error.message);
    }

    // Test 2: Check if jobs endpoint works
    console.log('\n📍 Test 2: Checking jobs endpoint...');
    try {
      const jobsRes = await axios.get(`${API_BASE}/jobs`, { timeout: 5000 });
      const jobs = jobsRes.data?.data || jobsRes.data || [];
      logTest('Jobs API', jobs.length > 0 ? 'PASS' : 'FAIL', `Found ${jobs.length} jobs`);
    } catch (error: any) {
      logTest('Jobs API', 'FAIL', error.message);
    }

    // Test 3: Check if roadmaps endpoint works
    console.log('\n📍 Test 3: Checking roadmaps endpoint...');
    try {
      const roadmapsRes = await axios.get(`${API_BASE}/roadmaps`, { timeout: 5000 });
      const roadmaps = roadmapsRes.data?.data || roadmapsRes.data || [];
      logTest('Roadmaps API', roadmaps.length > 0 ? 'PASS' : 'FAIL', `Found ${roadmaps.length} roadmaps`);
    } catch (error: any) {
      logTest('Roadmaps API', 'FAIL', error.message);
    }

    // Test 4: Create a test user and run assessment
    console.log('\n📍 Test 4: Testing user registration...');
    try {
      const registerRes = await axios.post(`${API_BASE}/auth/register`, {
        email: `test-e2e-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        fullName: 'E2E Test User',
      }, { timeout: 5000 });
      
      const userData = registerRes.data?.data || registerRes.data;
      const userId = userData?.user?.id || userData?.id;
      
      logTest('User Registration', userId ? 'PASS' : 'FAIL', `User ID: ${userId}`);

      if (userId) {
        // Test 5: Submit an assessment
        console.log('\n📍 Test 5: Testing assessment submission...');
        try {
          const assessmentRes = await axios.post(`${API_BASE}/assessment/submit`, {
            answers: [
              { question: 'Interest in coding', answer: 'High' },
              { question: 'Problem solving ability', answer: 'Advanced' },
              { question: 'Team collaboration', answer: 'Excellent' },
            ],
            selectedOptions: ['option1', 'option2', 'option3'],
          }, {
            headers: { Authorization: `Bearer ${registerRes.data?.token || ''}` },
            timeout: 5000,
          });

          const assessment = assessmentRes.data?.data || assessmentRes.data;
          logTest('Assessment Submission', assessment ? 'PASS' : 'FAIL', `Assessment recorded`);

          // Test 6: Get recommendations
          if (assessment) {
            console.log('\n📍 Test 6: Testing recommendations endpoint...');
            try {
              const recsRes = await axios.get(`${API_BASE}/recommendations`, {
                headers: { Authorization: `Bearer ${registerRes.data?.token || ''}` },
                timeout: 5000,
              });

              const recs = recsRes.data?.data || recsRes.data || [];
              logTest('Career Recommendations', recs && recs.length > 0 ? 'PASS' : 'FAIL', `Found ${recs.length || 0} recommendations`);
            } catch (error: any) {
              logTest('Career Recommendations', 'FAIL', error.message);
            }
          }
        } catch (error: any) {
          logTest('Assessment Submission', 'FAIL', error.message);
        }
      }
    } catch (error: any) {
      logTest('User Registration', 'FAIL', error.message);
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

  if (results.failed === 0 && results.passed > 0) {
    console.log('✨ All critical tests passed! Pragyan is ready.\n');
  } else {
    console.log('⚠️ Some tests failed. Check endpoints and services.\n');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the test
testE2E().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
