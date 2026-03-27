import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('/api/getMatch Route', () => {
  it('returns a 400 error if puuid is missing from the URL', async () => {
    // 1. Create a fake request with NO search params
    const request = new Request('http://localhost:3000/api/getMatch');

    // 2. Call the GET function directly
    const response = await GET(request);

    // 3. Parse the JSON response
    const data = await response.json();

    // 4. Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing puuid');
  });

  it('returns a 400 error if the puuid parameter is explicitly empty', async () => {
    const request = new Request('http://localhost:3000/api/getMatch?puuid=');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing puuid');
  });
});
