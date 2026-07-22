import { randomBytes } from 'crypto';

export const createShareToken = () => randomBytes(18).toString('base64url');
