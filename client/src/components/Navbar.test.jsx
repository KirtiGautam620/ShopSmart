import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import * as auth from '../utils/auth';

vi.mock('../utils/auth');

describe('Navbar Component', () => {
    const renderNavbar = (props = {}) => {
        return render(
            <BrowserRouter>
                <Navbar cartCount={0} {...props} />
            </BrowserRouter>
        );
    };

    it('should show Login and Sign Up when not logged in', () => {
        auth.isLoggedIn.mockReturnValue(false);
        renderNavbar();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    });

    it('should show Cart, Orders, and Logout when logged in', () => {
        auth.isLoggedIn.mockReturnValue(true);
        renderNavbar({ cartCount: 5 });
        expect(screen.getByText(/Cart/i)).toBeInTheDocument();
        expect(screen.getByText(/Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });
});
