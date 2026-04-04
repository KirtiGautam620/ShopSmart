import request from 'supertest';
import app from './app.js';

describe('API Integration', () => {
    it('should return a 200 OK for the public products route', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 for a protected route when no token is provided', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.status).toBe(401);
    });
});
