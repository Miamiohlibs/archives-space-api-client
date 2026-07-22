import { z } from 'zod';
import { dateSchema, extentSchema, externalIdSchema, instanceSchema, langMaterialSchema, linkedAgentSchema, linkedEventSchema, noteSchema, repositorySchema, rightsStatementSchema, subjectSchema, type ResourceRecord } from './RepoResourcesSchema.js';
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
    ancestors: {
        ref: string;
        level: string;
        _resolved?: ResourceRecord;
    }[];
    instances: z.infer<typeof instanceSchema>[];
    notes: z.infer<typeof noteSchema>[];
    accession_links: unknown[];
    uri: string;
    repository: z.infer<typeof repositorySchema>;
    resource: {
        ref: string;
        _resolved?: ResourceRecord;
    };
    parent?: {
        ref: string;
        _resolved?: ArchivalObjectRecord;
    };
    has_unpublished_ancestor: boolean;
}
export declare const repoArchivalObjectSchema: z.ZodType<ArchivalObjectRecord>;
//# sourceMappingURL=RepoArchivalObjectsSchema.d.ts.map