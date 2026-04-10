export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    // TODO:
    // logger.error(`ENV ERROR: Missing required environment variable: ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
