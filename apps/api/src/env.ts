import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';

loadEnv({
  path: fileURLToPath(new URL('../../../.env', import.meta.url)),
  quiet: true,
});

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim() === '') {
    throw new Error(`${name} is required.`);
  }

  return value;
}
