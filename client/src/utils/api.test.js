import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';

describe('API Utility', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
        localStorage.clear();
    });

    it('should include Authorization header when logged in', async () => {
        localStorage.setItem('token', 'fake-token');
        globalThis.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });

        await api.get('/api/test');

        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/test'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer fake-token',
                }),
            })
        );
    });

    it('should NOT include Authorization header when not logged in', async () => {
        localStorage.removeItem('token');
        globalThis.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });

        await api.get('/api/test');

        const options = globalThis.fetch.mock.calls[0][1];
        expect(options.headers.Authorization).toBeUndefined();
    });
});
