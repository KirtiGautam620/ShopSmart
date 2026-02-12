import { jest } from '@jest/globals';
import { requireAuth } from './auth.middleware.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if no Authorization header is present', () => {
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
  });

  it('should return 401 if Authorization header does not start with Bearer', () => {
    req.headers.authorization = 'InvalidToken';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should call next() if a valid token is provided', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    const token = jwt.sign(payload, secret);
    
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
  });

  it('should return 401 if an invalid token is provided', () => {
    req.headers.authorization = 'Bearer invalid-token';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
  });
});
