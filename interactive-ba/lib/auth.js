import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');

export function parseTokenFromReq(req) {
  const header = req.headers?.authorization;
  if (header && header.startsWith('Bearer ')) return header.split(' ')[1];
  const raw = req.headers?.cookie;
  if (!raw) return null;
  const parsed = cookie.parse(raw || '');
  return parsed.auth || null;
}

export function verifyAuth(req) {
  const token = parseTokenFromReq(req);
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}
