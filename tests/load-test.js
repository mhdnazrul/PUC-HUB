import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up to 20 users
    { duration: '1m', target: 50 },  // Maintain 50 users (spike test)
    { duration: '30s', target: 0 }   // Scale down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
    http_req_failed: ['rate<0.01']    // HTTP error rate must be below 1%
  }
};

export default function () {
  const API_BASE = 'http://localhost:3000/api/v1';

  // Request health check to verify active server performance
  const res = http.get(`${API_BASE}/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'healthy status': (r) => r.body.includes('healthy')
  });
  sleep(1);
}
