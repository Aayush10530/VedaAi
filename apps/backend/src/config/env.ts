import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string(),
  GROQ_API_KEY: z.string().startsWith('gsk_', 'Groq API key must start with gsk_'),
  FRONTEND_URL: z.string().url(),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.string().default('10').transform(Number),
  ASSIGNED_BY: z.string().default('Aayush'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const envResult = EnvSchema.safeParse(process.env);
if (!envResult.success) {
  console.error('Invalid environment configuration:');
  envResult.error.errors.forEach((err) => {
    console.error(`  - ${err.path.join('.')}: ${err.message}`);
  });
  process.exit(1);
}

export const env = envResult.data;
