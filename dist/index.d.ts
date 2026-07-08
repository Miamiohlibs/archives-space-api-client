import { z } from 'zod';
export { default as AspaceClient } from './AspaceClient.js';
import { tokenResponseSchema } from './schemas/TokenResponseSchema.js';
export { tokenResponseSchema };
import { repoResourcesSchema } from './schemas/RepoResourcesSchema.js';
export { repoResourcesSchema };
import { repoArchivalObjectSchema } from './schemas/RepoArchivalObjectsSchema.js';
export { repoArchivalObjectSchema };
import { repoTopContainerSchema } from './schemas/RepoTopContainersSchema.js';
export { repoTopContainerSchema };
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type RepoResources = z.infer<typeof repoResourcesSchema>;
export type RepoArchivalObject = z.infer<typeof repoArchivalObjectSchema>;
export type RepoTopContainer = z.infer<typeof repoTopContainerSchema>;
//# sourceMappingURL=index.d.ts.map