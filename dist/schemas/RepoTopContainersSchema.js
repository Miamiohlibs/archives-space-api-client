import { topContainerResolvedSchema } from './RepoResourcesSchema.js';
// The top-level shape returned by GET /repositories/:id/top_containers/:id
// is identical to a top container as it appears `_resolved` elsewhere (e.g.
// under a sub_container), so it's reused directly rather than redefined.
export const repoTopContainerSchema = topContainerResolvedSchema;
