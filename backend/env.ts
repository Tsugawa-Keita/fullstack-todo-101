import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    PORT: z.coerce.number(),
    CORS_ORIGIN: z.url(),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});