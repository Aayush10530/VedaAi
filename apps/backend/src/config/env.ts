import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string(),
  GROQ_API_KEY: z.string(),
  FRONTEND_URL: z.string().url(),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.string().default('10').transform(Number),
  ASSIGNED_BY: z.string().default('Aayush'),
});

let validatedEnv: z.infer<typeof EnvSchema>;
try {
  validatedEnv = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid environment configuration:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('Environment validation failed:', error);
  }
  process.exit(1);
}

export const env = validatedEnv;
