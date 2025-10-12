import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Generates a JSON Web Token for a given payload. The payload should include
// identifying information such as the user ID and role. The secret used to
// sign the token comes from the environment configuration. The token expires
// after 7 days by default.

export function generateToken(payload: any, expiresIn = '7d'): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}