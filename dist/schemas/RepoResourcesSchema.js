import { z } from 'zod';
// A bare reference to another record, with no embedded data.
export const refSchema = z.object({
    ref: z.string(),
});
// A reference that may optionally be expanded (via the ArchivesSpace
// `resolve[]` query param) to include the referenced record under `_resolved`.
export const resolvableRefSchema = (resolvedSchema) => z.object({
    ref: z.string(),
    _resolved: resolvedSchema.optional(),
});
// A resolvable reference to the archival object (or occasionally a resource)
// immediately above a record in the tree. Both `repoResourcesSchema` and
// `repoArchivalObjectSchema` use this for their `parent` field, but the full
// archival object schema lives in RepoArchivalObjectsSchema.ts, which already
// imports from this module — a value import in the other direction would be
// a genuine circular dependency and deadlock on whichever file's module
// happens to load first. `registerArchivalObjectSchema` lets that module
// plug its schema in after the fact instead, keeping the import graph
// one-directional.
let archivalObjectSchema;
export function registerArchivalObjectSchema(schema) {
    archivalObjectSchema = schema;
}
export const parentSchema = resolvableRefSchema(z.lazy(() => {
    if (!archivalObjectSchema) {
        throw new Error('parentSchema used before RepoArchivalObjectsSchema.js registered its schema');
    }
    return archivalObjectSchema;
}));
export const dateSchema = z
    .object({
    lock_version: z.number(),
    begin: z.string().optional(),
    end: z.string().optional(),
    calendar: z.string().optional(),
    certainty: z.string().optional(),
    era: z.string().optional(),
    expression: z.string().optional(),
    date_type: z.string(),
    label: z.string(),
    jsonmodel_type: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const extentSchema = z
    .object({
    lock_version: z.number(),
    number: z.string(),
    portion: z.string(),
    extent_type: z.string(),
    jsonmodel_type: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const externalIdSchema = z
    .object({
    external_id: z.string(),
    source: z.string().optional(),
    jsonmodel_type: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
// Rights statements. `acts`, `linked_agents`, and `notes` were always empty
// across the sample data, so their item shapes are left unknown rather than
// guessed.
export const rightsStatementSchema = z
    .object({
    lock_version: z.number(),
    identifier: z.string(),
    rights_type: z.string().optional(),
    other_rights_basis: z.string().optional(),
    start_date: z.string().optional(),
    jsonmodel_type: z.string(),
    external_documents: z.array(z.unknown()),
    acts: z.array(z.unknown()),
    linked_agents: z.array(z.unknown()),
    notes: z.array(z.unknown()),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
// Notes (top-level `notes` and `lang_materials[].notes`) are a discriminated
// union keyed on `jsonmodel_type`. `note_text` only ever shows up nested
// inside a `note_multipart`'s `subnotes`.
const noteTextSchema = z
    .object({
    jsonmodel_type: z.literal('note_text'),
    content: z.string(),
    publish: z.boolean().optional(),
})
    .catchall(z.string().optional());
const noteSinglepartSchema = z
    .object({
    jsonmodel_type: z.literal('note_singlepart'),
    persistent_id: z.string(),
    type: z.string(),
    label: z.string().optional(),
    content: z.array(z.string()),
    publish: z.boolean().optional(),
})
    .catchall(z.string().optional());
const noteMultipartSchema = z
    .object({
    jsonmodel_type: z.literal('note_multipart'),
    persistent_id: z.string(),
    type: z.string(),
    label: z.string().optional(),
    subnotes: z.array(noteTextSchema),
    publish: z.boolean().optional(),
    rights_restriction: z
        .object({
        local_access_restriction_type: z.array(z.string()),
    })
        .optional(),
})
    .catchall(z.string().optional());
const noteLangmaterialSchema = z
    .object({
    jsonmodel_type: z.literal('note_langmaterial'),
    persistent_id: z.string(),
    type: z.string(),
    content: z.array(z.string()),
    publish: z.boolean().optional(),
})
    .catchall(z.string().optional());
export const noteSchema = z.discriminatedUnion('jsonmodel_type', [
    noteSinglepartSchema,
    noteMultipartSchema,
    noteLangmaterialSchema,
]);
const languageAndScriptSchema = z
    .object({
    lock_version: z.number(),
    language: z.string(),
    jsonmodel_type: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const langMaterialSchema = z
    .object({
    lock_version: z.number(),
    jsonmodel_type: z.string(),
    language_and_script: languageAndScriptSchema.optional(),
    notes: z.array(noteSchema),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
// Linked agents (creators, sources, subjects of the resource).
const structuredDateRangeSchema = z
    .object({
    lock_version: z.number(),
    begin_date_standardized: z.string(),
    begin_date_standardized_type: z.string(),
    end_date_standardized: z.string(),
    end_date_standardized_type: z.string(),
    jsonmodel_type: z.string(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
const agentDateOfExistenceSchema = z
    .object({
    lock_version: z.number(),
    date_label: z.string(),
    date_type_structured: z.string(),
    structured_date_range: structuredDateRangeSchema,
    jsonmodel_type: z.string(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
const agentNameSchema = z
    .object({
    lock_version: z.number(),
    primary_name: z.string(),
    rest_of_name: z.string().optional(),
    subordinate_name_1: z.string().optional(),
    subordinate_name_2: z.string().optional(),
    subordinate_name_3: z.string().optional(),
    sort_name: z.string(),
    sort_name_auto_generate: z.boolean(),
    authorized: z.boolean(),
    is_display_name: z.boolean(),
    source: z.string().optional(),
    rules: z.string().optional(),
    language: z.string().optional(),
    name_order: z.string().optional(),
    dates: z.string().optional(),
    conference_meeting: z.boolean().optional(),
    jurisdiction: z.boolean().optional(),
    jsonmodel_type: z.string(),
    use_dates: z.array(z.unknown()),
    parallel_names: z.array(z.unknown()),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
// Agents carry many sub-record arrays (contacts, conventions declarations,
// etc.) that were always empty across the sample data, so their item shape
// is left unknown rather than guessed.
const agentResolvedSchema = z
    .object({
    lock_version: z.number(),
    publish: z.boolean().optional(),
    is_slug_auto: z.boolean(),
    is_linked_to_published_record: z.boolean(),
    jsonmodel_type: z.string(),
    agent_type: z.string(),
    title: z.string(),
    uri: z.string(),
    display_name: agentNameSchema,
    names: z.array(agentNameSchema),
    dates_of_existence: z.array(agentDateOfExistenceSchema),
    linked_agent_roles: z.array(z.string()),
    agent_genders: z.array(z.unknown()).optional(),
    agent_contacts: z.array(z.unknown()),
    agent_record_controls: z.array(z.unknown()),
    agent_alternate_sets: z.array(z.unknown()),
    agent_conventions_declarations: z.array(z.unknown()),
    agent_other_agency_codes: z.array(z.unknown()),
    agent_maintenance_histories: z.array(z.unknown()),
    agent_record_identifiers: z.array(z.unknown()),
    agent_identifiers: z.array(z.unknown()),
    agent_sources: z.array(z.unknown()),
    agent_places: z.array(z.unknown()),
    agent_occupations: z.array(z.unknown()),
    agent_functions: z.array(z.unknown()),
    agent_topics: z.array(z.unknown()),
    agent_resources: z.array(z.unknown()),
    external_documents: z.array(z.unknown()),
    notes: z.array(z.unknown()),
    used_within_repositories: z.array(z.unknown()),
    used_within_published_repositories: z.array(z.unknown()),
    used_languages: z.array(z.unknown()),
    metadata_rights_declarations: z.array(z.unknown()),
    related_agents: z.array(z.unknown()),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const linkedAgentSchema = resolvableRefSchema(agentResolvedSchema).extend({
    role: z.string(),
    terms: z.array(z.unknown()),
});
// Subjects.
const subjectTermSchema = z
    .object({
    lock_version: z.number(),
    term: z.string(),
    term_type: z.string(),
    vocabulary: z.string(),
    uri: z.string(),
    jsonmodel_type: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
const subjectResolvedSchema = z
    .object({
    lock_version: z.number(),
    title: z.string(),
    source: z.string().optional(),
    vocabulary: z.string(),
    uri: z.string(),
    publish: z.boolean().optional(),
    is_slug_auto: z.boolean(),
    is_linked_to_published_record: z.boolean(),
    jsonmodel_type: z.string(),
    terms: z.array(subjectTermSchema),
    external_ids: z.array(externalIdSchema),
    external_documents: z.array(z.unknown()),
    metadata_rights_declarations: z.array(z.unknown()),
    used_within_repositories: z.array(z.unknown()),
    used_within_published_repositories: z.array(z.unknown()),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const subjectSchema = resolvableRefSchema(subjectResolvedSchema);
// Classifications.
const classificationPathSchema = z
    .object({
    identifier: z.string(),
    title: z.string(),
})
    .catchall(z.string().optional());
const classificationResolvedSchema = z
    .object({
    lock_version: z.number(),
    identifier: z.string(),
    title: z.string(),
    publish: z.boolean().optional(),
    is_slug_auto: z.boolean(),
    has_classification_terms: z.boolean(),
    jsonmodel_type: z.string(),
    uri: z.string(),
    path_from_root: z.array(classificationPathSchema),
    linked_records: z.array(refSchema),
    repository: refSchema,
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
const classificationSchema = resolvableRefSchema(classificationResolvedSchema);
// Linked events.
const linkedEventAgentSchema = z.object({
    ref: z.string(),
    role: z.string(),
});
const linkedEventRecordSchema = z.object({
    ref: z.string(),
    role: z.string(),
});
const linkedEventResolvedSchema = z
    .object({
    lock_version: z.number(),
    event_type: z.string(),
    outcome: z.string(),
    outcome_note: z.string(),
    timestamp: z.string(),
    suppressed: z.boolean(),
    jsonmodel_type: z.string(),
    uri: z.string(),
    repository: refSchema,
    linked_agents: z.array(linkedEventAgentSchema),
    linked_records: z.array(linkedEventRecordSchema),
    external_ids: z.array(z.unknown()),
    external_documents: z.array(z.unknown()),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const linkedEventSchema = resolvableRefSchema(linkedEventResolvedSchema);
// Repository.
const repositoryResolvedSchema = z
    .object({
    lock_version: z.number(),
    repo_code: z.string(),
    name: z.string(),
    display_string: z.string(),
    slug: z.string(),
    is_slug_auto: z.boolean(),
    publish: z.boolean().optional(),
    oai_is_disabled: z.boolean(),
    oai_sets_available: z.string(),
    position: z.number(),
    jsonmodel_type: z.string(),
    uri: z.string(),
    agent_representation: refSchema,
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const repositorySchema = resolvableRefSchema(repositoryResolvedSchema);
// Instances / containers.
export const activeRestrictionSchema = z
    .object({
    id: z.number(),
    resource_id: z.number().optional(),
    archival_object_id: z.number().optional(),
    restriction_note_type: z.string(),
    local_access_restriction_type: z.array(z.string()),
    end: z.string().optional(),
    jsonmodel_type: z.string(),
    linked_records: refSchema,
})
    .catchall(z.string().optional());
const locationResolvedSchema = z
    .object({
    lock_version: z.number(),
    building: z.string(),
    title: z.string(),
    floor: z.string().optional(),
    room: z.string().optional(),
    area: z.string().optional(),
    coordinate_1_label: z.string().optional(),
    coordinate_1_indicator: z.string().optional(),
    coordinate_2_label: z.string().optional(),
    coordinate_2_indicator: z.string().optional(),
    coordinate_3_label: z.string().optional(),
    coordinate_3_indicator: z.string().optional(),
    jsonmodel_type: z.string(),
    external_ids: z.array(z.unknown()),
    functions: z.array(z.unknown()),
    uri: z.string(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
})
    .catchall(z.string().optional());
export const containerLocationSchema = resolvableRefSchema(locationResolvedSchema).extend({
    status: z.string(),
    start_date: z.string(),
    jsonmodel_type: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
});
export const collectionRefSchema = resolvableRefSchema(z.lazy(() => repoResourcesSchema)).extend({
    identifier: z.string(),
    display_string: z.string(),
});
export const topContainerResolvedSchema = z.object({
    lock_version: z.number(),
    indicator: z.string(),
    type: z.string().optional(),
    created_for_collection: z.string().optional(),
    display_string: z.string(),
    long_display_string: z.string(),
    restricted: z.boolean(),
    is_linked_to_published_record: z.boolean(),
    jsonmodel_type: z.string(),
    uri: z.string(),
    repository: repositorySchema,
    collection: z.array(collectionRefSchema),
    series: z.array(z.unknown()),
    container_locations: z.array(containerLocationSchema),
    active_restrictions: z.array(activeRestrictionSchema),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
});
export const topContainerSchema = resolvableRefSchema(topContainerResolvedSchema);
const subContainerSchema = z.object({
    lock_version: z.number(),
    jsonmodel_type: z.string(),
    top_container: topContainerSchema,
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
    type: z.string().optional(),
    indicator: z.string().optional(),
    indicator_2: z.string().optional(),
    type_2: z.string().optional(),
});
export const instanceSchema = z.object({
    lock_version: z.number(),
    instance_type: z.string(),
    is_representative: z.boolean(),
    jsonmodel_type: z.string(),
    sub_container: subContainerSchema,
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
});
const treeNodeSchema = z.lazy(() => z.object({
    title: z.string(),
    id: z.number(),
    record_uri: z.string(),
    publish: z.boolean().optional(),
    suppressed: z.boolean(),
    node_type: z.string(),
    level: z.string(),
    instance_types: z.array(z.string()),
    has_children: z.boolean(),
    children: z.array(treeNodeSchema),
    containers: z.array(z.unknown()),
}));
const nestedAncestorSchema = z.object({
    level: z.string(),
    ref: z.string(),
});
const treeResolvedSchema = z.object({
    title: z.string(),
    id: z.number(),
    record_uri: z.string(),
    publish: z.boolean().optional(),
    suppressed: z.boolean(),
    node_type: z.string(),
    level: z.string(),
    instance_types: z.array(z.string()),
    jsonmodel_type: z.string(),
    finding_aid_filing_title: z.string().optional(),
    children: z.array(treeNodeSchema),
    containers: z.array(z.unknown()),
});
const treeSchema = resolvableRefSchema(treeResolvedSchema);
// The resource itself.
export const repoResourcesSchema = z
    .object({
    lock_version: z.number(),
    title: z.string(),
    publish: z.boolean().optional(),
    restrictions: z.boolean().optional(),
    suppressed: z.boolean(),
    is_slug_auto: z.boolean(),
    jsonmodel_type: z.string(),
    uri: z.string(),
    level: z.string(),
    resource_type: z.string().optional(),
    id_0: z.string().optional(),
    id_1: z.string().optional(),
    id_2: z.string().optional(),
    accession_links: z.array(z.unknown()).optional(),
    ancestors: z.array(nestedAncestorSchema).optional(),
    display_string: z.string().optional(),
    finding_aid_title: z.string().optional(),
    finding_aid_filing_title: z.string().optional(),
    finding_aid_date: z.string().optional(),
    finding_aid_author: z.string().optional(),
    finding_aid_description_rules: z.string().optional(),
    finding_aid_language: z.string().optional(),
    finding_aid_script: z.string().optional(),
    finding_aid_language_note: z.string().optional(),
    finding_aid_status: z.string().optional(),
    has_unpublished_ancestor: z.boolean().optional(),
    created_by: z.string().optional(),
    last_modified_by: z.string().optional(),
    create_time: z.string(),
    system_mtime: z.string(),
    user_mtime: z.string(),
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
    revision_statements: z.array(z.unknown()).optional(),
    instances: z.array(instanceSchema),
    deaccessions: z.array(z.unknown()).optional(),
    ead_id: z.string().optional(),
    ead_location: z.string().optional(),
    related_accessions: z.array(z.unknown()).optional(),
    classifications: z.array(classificationSchema).optional(),
    notes: z.array(noteSchema),
    metadata_rights_declarations: z.array(z.unknown()).optional(),
    parent: parentSchema.optional(),
    position: z.number().optional(),
    ref_id: z.string().optional(),
    resource: refSchema.optional(),
    restrictions_apply: z.boolean().optional(),
    repository: repositorySchema,
    tree: treeSchema.optional(),
})
    .catchall(z.string().optional());
