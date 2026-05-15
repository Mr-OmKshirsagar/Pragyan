// src/utils/password.ts

import bcrypt from 'bcryptjs';
import { config } from '@/config/env';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcrypt.rounds);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
