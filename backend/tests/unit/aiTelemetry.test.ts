jest.mock('@/lib/redis');

describe('aiTelemetry', () => {
  beforeEach(() => {
    // reset telemetry by reloading module
    jest.resetModules();
  });

  it('records calls and failures', () => {
    const telemetry = require('@/lib/aiTelemetry');
    telemetry.recordCall(5, 10);
    telemetry.recordFailure();
    telemetry.recordFallback();
    const stats = telemetry.getTelemetry();
    expect(stats.calls).toBe(1);
    expect(stats.tokens).toBe(5);
    expect(stats.failures).toBe(1);
    expect(stats.fallbackCount).toBe(1);
  });
});
