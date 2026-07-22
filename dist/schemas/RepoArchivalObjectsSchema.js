import { z } from 'zod';
import { dateSchema, extentSchema, externalIdSchema, instanceSchema, langMaterialSchema, linkedAgentSchema, linkedEventSchema, noteSchema, parentSchema, registerArchivalObjectSchema, repoResourcesSchema, repositorySchema, resolvableRefSchema, rightsStatementSchema, subjectSchema, } from './RepoResourcesSchema.js';
// An ancestor is a resolvable reference to the resource or archival object
// above this one in the tree, plus the `level` of that ancestor (which is
// redundant with the `level` on the resolved record itself, but is present
// even when the reference isn't resolved).
const ancestorSchema = resolvableRefSchema(repoResourcesSchema).extend({
    level: z.string(),
});
// The runtime field list for `_resolved` in `parentSchema` (RepoResourcesSchema.ts)
// — mirrored by hand in the `ArchivalObjectRecord` interface above.
export const repoArchivalObjectSchema = z.object({
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
