// global test setup
process.env.NODE_ENV = 'test';
// Ensure a predictable AI test mode
process.env.AI_PROVIDER = process.env.AI_PROVIDER || 'local';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key';

jest.setTimeout(20000);
// cleanup helpers
afterEach(() => {
	jest.clearAllMocks();
	try { jest.useRealTimers(); } catch (e) {}
});

afterAll(() => {
	// ensure timers are cleared
	jest.clearAllTimers && jest.clearAllTimers();
});
