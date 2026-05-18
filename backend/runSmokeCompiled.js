// Runs compiled Gemini provider and prints telemetry in same process
require('dotenv').config();
const gp = require('./dist/ai/GeminiProvider.js');
const telemetry = require('./dist/lib/aiTelemetry.js');

(async () => {
  try {
    const res = await gp.generateText('Explain AI Engineering career');
    console.log('SMOKE RES:', res);
  } catch (e) {
    console.error('SMOKE ERROR:', e);
  }

  try {
    console.log('TELEMETRY:', telemetry.getTelemetry());
  } catch (e) {
    console.error('TELEMETRY ERROR:', e);
  }
})();
