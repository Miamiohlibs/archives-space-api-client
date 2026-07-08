import { z } from 'zod';
export { default as AspaceClient } from './AspaceClient.js';
import { tokenResponseSchema } from './schemas/TokenResponseSchema.js';
export { tokenResponseSchema };
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
//# sourceMappingURL=index.d.ts.map