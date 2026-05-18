function makeReq(ip='1.2.3.4'){
  return { ip } as any;
}
function makeRes(){
  return { status: jest.fn(()=>({ json: jest.fn() })), json: jest.fn() } as any;
}

describe('in-memory rateLimiter', ()=>{
  it('blocks after tokens exhausted', ()=>{
    // reduce tokens for test by directly manipulating bucket map via module import
    const limiterModule = require('@/middleware/rateLimiter');
    const req = makeReq();
    const res = makeRes();
    const next = jest.fn();

    // consume MAX_TOKENS (default 10) + 1
    for(let i=0;i<11;i++){
      limiterModule.rateLimiter(req,res,next);
    }
    // last call should have produced a 429 response on res
    expect(res.status).toHaveBeenCalledWith(429);
  });
});
