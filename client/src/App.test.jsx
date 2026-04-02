import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
    localStorage.clear();
});

describe('App', () => {
    it('renders SweetCrumbs brand', async () => {
        render(<App />);
        const brand = await screen.findAllByText(/SweetCrumbs/i);
        expect(brand.length).toBeGreaterThan(0);
    });
});
