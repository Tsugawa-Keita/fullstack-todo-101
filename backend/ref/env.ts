import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    PORT: z.int().min(1).max(65535).default(3001),
    CORS_ORIGIN: z.url(),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});