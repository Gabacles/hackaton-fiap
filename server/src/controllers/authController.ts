import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/userService';
import { generateToken } from '../utils/generateToken';
import { Role } from '@prisma/client';

// Handles user registration. Expects email, password and role in the body. On
// success returns a JWT and the user data. On error (existing user or
// validation failure) returns an appropriate HTTP status.
export async function register(req: Request, res: Response) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const user = await registerUser(email, password, role as Role);
    const token = generateToken({ id: user.id, role: user.role });
    return res.status(201).json({ token, user });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

// Handles user login. Expects email and password. If credentials are valid
// returns a JWT and user data; otherwise returns 401 Unauthorized.
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken({ id: user.id, role: user.role });
  return res.json({ token, user });
}