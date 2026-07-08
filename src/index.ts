import { z } from 'zod';
export { default as AspaceClient } from './AspaceClient.js';

import { tokenResponseSchema } from './schemas/TokenResponseSchema.js';
export { tokenResponseSchema };

import { repoResourcesSchema } from './schemas/RepoResourcesSchema.js';
export { repoResourcesSchema };

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type RepoResources = z.infer<typeof repoResourcesSchema>;
