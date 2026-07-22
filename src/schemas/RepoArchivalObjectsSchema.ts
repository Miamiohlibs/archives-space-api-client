import { z } from 'zod';
import {
  dateSchema,
  extentSchema,
  externalIdSchema,
  instanceSchema,
  langMaterialSchema,
  linkedAgentSchema,
  linkedEventSchema,
  noteSchema,
  parentSchema,
  registerArchivalObjectSchema,
  repoResourcesSchema,
  repositorySchema,
  resolvableRefSchema,
  rightsStatementSchema,
  subjectSchema,
  type ResourceRecord,
} from './RepoResourcesSchema.js';

// An ancestor is a resolvable reference to the resource or archival object
// above this one in the tree, plus the `level` of that ancestor (which is
// redundant with the `level` on the resolved record itself, but is present
// even when the reference isn't resolved).
const ancestorSchema = resolvableRefSchema(repoResourcesSchema).extend({
  level: z.string(),
});

// The full shape of a resolved archival object, mirroring the fields of
// `repoArchivalObjectSchema` below. This is hand-written (rather than derived
// via z.infer<typeof repoArchivalObjectSchema>) because `parentSchema`
// (defined in RepoResourcesSchema.ts, shared with `repoResourcesSchema`)
// resolves back to this same shape, and it needs a concrete type to refer to
// before `repoArchivalObjectSchema` exists. Keep this in sync by hand when
// adding/renaming fields below — `tsc` will catch a field removed here but
// still present below, but not the reverse.
export interface ArchivalObjectRecord {
  lock_version: number;
  position: number;
  publish: boolean;
  ref_id: string;
  title: string;
  display_string: string;
  restrictions_apply: boolean;
  created_by?: string;
  last_modified_by?: string;
  create_time: string;
  system_mtime: string;
  user_mtime: string;
  suppressed: boolean;
  is_slug_auto: boolean;
  level: string;
  jsonmodel_type: string;
  external_ids: z.infer<typeof externalIdSchema>[];
  subjects: z.infer<typeof subjectSchema>[];
  linked_events: z.infer<typeof linkedEventSchema>[];
  extents: z.infer<typeof extentSchema>[];
  lang_materials: z.infer<typeof langMaterialSchema>[];
  dates: z.infer<typeof dateSchema>[];
  external_documents: unknown[];
  rights_statements: z.infer<typeof rightsStatementSchema>[];
  linked_agents: z.infer<typeof linkedAgentSchema>[];
  import_previous_arks: unknown[];
  ancestors: { ref: string; level: string; _resolved?: ResourceRecord }[];
  instances: z.infer<typeof instanceSchema>[];
  notes: z.infer<typeof noteSchema>[];
  accession_links: unknown[];
  uri: string;
  repository: z.infer<typeof repositorySchema>;
  resource: { ref: string; _resolved?: ResourceRecord };
  parent?: { ref: string; _resolved?: ArchivalObjectRecord };
  has_unpublished_ancestor: boolean;
}

// The runtime field list for `_resolved` in `parentSchema` (RepoResourcesSchema.ts)
// — mirrored by hand in the `ArchivalObjectRecord` interface above.
export const repoArchivalObjectSchema: z.ZodType<ArchivalObjectRecord> =
  z.object({
    lock_version: z.number(),
    position: z.number(),
    publish: z.boolean(),
    ref_id: z.string(),
    title: z.string(),
    display_string: z.string(),
    restrictions_apply: z.boolean(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
    suppressed: z.boolean(),
    is_slug_auto: z.boolean(),
    level: z.string(),
    jsonmodel_type: z.string(),
    external_ids: z.array(externalIdSchema),
    subjects: z.array(subjectSchema),
    linked_events: z.array(linkedEventSchema),
    extents: z.array(extentSchema),
    lang_materials: z.array(langMaterialSchema),
    dates: z.array(dateSchema),
    external_documents: z.array(z.unknown()),
    rights_statements: z.array(rightsStatementSchema),
    linked_agents: z.array(linkedAgentSchema),
    import_previous_arks: z.array(z.unknown()),
    ancestors: z.array(ancestorSchema),
    instances: z.array(instanceSchema),
    notes: z.array(noteSchema),
    accession_links: z.array(z.unknown()),
    uri: z.string(),
    repository: repositorySchema,
    resource: resolvableRefSchema(repoResourcesSchema),
    parent: parentSchema.optional(),
    has_unpublished_ancestor: z.boolean(),
  });

registerArchivalObjectSchema(repoArchivalObjectSchema);
