import { z } from 'zod';

// A bare reference to another record, with no embedded data.
const refSchema = z.object({
  ref: z.string(),
});

// A reference that may optionally be expanded (via the ArchivesSpace
// `resolve[]` query param) to include the referenced record under `_resolved`.
const resolvableRefSchema = <T extends z.ZodTypeAny>(resolvedSchema: T) =>
  z.object({
    ref: z.string(),
    _resolved: resolvedSchema.optional(),
  });

const dateSchema = z.object({
  lock_version: z.number(),
  begin: z.string(),
  end: z.string(),
  calendar: z.string().optional(),
  certainty: z.string().optional(),
  era: z.string().optional(),
  date_type: z.string(),
  label: z.string(),
  jsonmodel_type: z.string(),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const extentSchema = z.object({
  lock_version: z.number(),
  number: z.string(),
  portion: z.string(),
  extent_type: z.string(),
  jsonmodel_type: z.string(),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const externalIdSchema = z.object({
  external_id: z.string(),
  source: z.string(),
  jsonmodel_type: z.string(),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

// Notes (top-level `notes` and `lang_materials[].notes`) are a discriminated
// union keyed on `jsonmodel_type`. `note_text` only ever shows up nested
// inside a `note_multipart`'s `subnotes`.
const noteTextSchema = z.object({
  jsonmodel_type: z.literal('note_text'),
  content: z.string(),
  publish: z.boolean(),
});

const noteSinglepartSchema = z.object({
  jsonmodel_type: z.literal('note_singlepart'),
  persistent_id: z.string(),
  type: z.string(),
  content: z.array(z.string()),
  publish: z.boolean(),
});

const noteMultipartSchema = z.object({
  jsonmodel_type: z.literal('note_multipart'),
  persistent_id: z.string(),
  type: z.string(),
  subnotes: z.array(noteTextSchema),
  publish: z.boolean(),
  rights_restriction: z
    .object({
      local_access_restriction_type: z.array(z.string()),
    })
    .optional(),
});

const noteLangmaterialSchema = z.object({
  jsonmodel_type: z.literal('note_langmaterial'),
  persistent_id: z.string(),
  type: z.string(),
  content: z.array(z.string()),
  publish: z.boolean(),
});

const noteSchema = z.discriminatedUnion('jsonmodel_type', [
  noteSinglepartSchema,
  noteMultipartSchema,
  noteLangmaterialSchema,
]);

const languageAndScriptSchema = z.object({
  lock_version: z.number(),
  language: z.string(),
  jsonmodel_type: z.string(),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const langMaterialSchema = z.object({
  lock_version: z.number(),
  jsonmodel_type: z.string(),
  language_and_script: languageAndScriptSchema.optional(),
  notes: z.array(noteSchema),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

// Linked agents (creators, sources, subjects of the resource).
const structuredDateRangeSchema = z.object({
  lock_version: z.number(),
  begin_date_standardized: z.string(),
  begin_date_standardized_type: z.string(),
  end_date_standardized: z.string(),
  end_date_standardized_type: z.string(),
  jsonmodel_type: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const agentDateOfExistenceSchema = z.object({
  lock_version: z.number(),
  date_label: z.string(),
  date_type_structured: z.string(),
  structured_date_range: structuredDateRangeSchema,
  jsonmodel_type: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const agentNameSchema = z.object({
  lock_version: z.number(),
  primary_name: z.string(),
  rest_of_name: z.string().optional(),
  subordinate_name_1: z.string().optional(),
  sort_name: z.string(),
  sort_name_auto_generate: z.boolean(),
  authorized: z.boolean(),
  is_display_name: z.boolean(),
  source: z.string(),
  rules: z.string().optional(),
  language: z.string().optional(),
  name_order: z.string().optional(),
  dates: z.string().optional(),
  conference_meeting: z.boolean().optional(),
  jurisdiction: z.boolean().optional(),
  jsonmodel_type: z.string(),
  use_dates: z.array(z.unknown()),
  parallel_names: z.array(z.unknown()),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

// Agents carry many sub-record arrays (contacts, conventions declarations,
// etc.) that were always empty across the sample data, so their item shape
// is left unknown rather than guessed.
const agentResolvedSchema = z.object({
  lock_version: z.number(),
  publish: z.boolean(),
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
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const linkedAgentSchema = resolvableRefSchema(agentResolvedSchema).extend({
  role: z.string(),
  terms: z.array(z.unknown()),
});

// Subjects.
const subjectTermSchema = z.object({
  lock_version: z.number(),
  term: z.string(),
  term_type: z.string(),
  vocabulary: z.string(),
  uri: z.string(),
  jsonmodel_type: z.string(),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const subjectResolvedSchema = z.object({
  lock_version: z.number(),
  title: z.string(),
  source: z.string(),
  vocabulary: z.string(),
  uri: z.string(),
  publish: z.boolean(),
  is_slug_auto: z.boolean(),
  is_linked_to_published_record: z.boolean(),
  jsonmodel_type: z.string(),
  terms: z.array(subjectTermSchema),
  external_ids: z.array(externalIdSchema),
  external_documents: z.array(z.unknown()),
  metadata_rights_declarations: z.array(z.unknown()),
  used_within_repositories: z.array(z.unknown()),
  used_within_published_repositories: z.array(z.unknown()),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const subjectSchema = resolvableRefSchema(subjectResolvedSchema);

// Classifications.
const classificationPathSchema = z.object({
  identifier: z.string(),
  title: z.string(),
});

const classificationResolvedSchema = z.object({
  lock_version: z.number(),
  identifier: z.string(),
  title: z.string(),
  publish: z.boolean(),
  is_slug_auto: z.boolean(),
  has_classification_terms: z.boolean(),
  jsonmodel_type: z.string(),
  uri: z.string(),
  path_from_root: z.array(classificationPathSchema),
  linked_records: z.array(refSchema),
  repository: refSchema,
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

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

const linkedEventResolvedSchema = z.object({
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
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const linkedEventSchema = resolvableRefSchema(linkedEventResolvedSchema);

// Repository.
const repositoryResolvedSchema = z.object({
  lock_version: z.number(),
  repo_code: z.string(),
  name: z.string(),
  display_string: z.string(),
  slug: z.string(),
  is_slug_auto: z.boolean(),
  publish: z.boolean(),
  oai_is_disabled: z.boolean(),
  oai_sets_available: z.string(),
  position: z.number(),
  jsonmodel_type: z.string(),
  uri: z.string(),
  agent_representation: refSchema,
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const repositorySchema = resolvableRefSchema(repositoryResolvedSchema);

// Instances / containers.
const activeRestrictionSchema = z.object({
  id: z.number(),
  resource_id: z.number().optional(),
  archival_object_id: z.number().optional(),
  restriction_note_type: z.string(),
  local_access_restriction_type: z.array(z.string()),
  end: z.string().optional(),
  jsonmodel_type: z.string(),
  linked_records: refSchema,
});

const containerLocationSchema = z.object({
  ref: z.string(),
  status: z.string(),
  start_date: z.string(),
  jsonmodel_type: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const collectionRefSchema = z.object({
  ref: z.string(),
  identifier: z.string(),
  display_string: z.string(),
});

const topContainerResolvedSchema = z.object({
  lock_version: z.number(),
  indicator: z.string(),
  type: z.string(),
  display_string: z.string(),
  long_display_string: z.string(),
  restricted: z.boolean(),
  is_linked_to_published_record: z.boolean(),
  jsonmodel_type: z.string(),
  uri: z.string(),
  repository: refSchema,
  collection: z.array(collectionRefSchema),
  series: z.array(z.unknown()),
  container_locations: z.array(containerLocationSchema),
  active_restrictions: z.array(activeRestrictionSchema),
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const topContainerSchema = resolvableRefSchema(topContainerResolvedSchema);

const subContainerSchema = z.object({
  lock_version: z.number(),
  jsonmodel_type: z.string(),
  top_container: topContainerSchema,
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

const instanceSchema = z.object({
  lock_version: z.number(),
  instance_type: z.string(),
  is_representative: z.boolean(),
  jsonmodel_type: z.string(),
  sub_container: subContainerSchema,
  created_by: z.string(),
  last_modified_by: z.string(),
  create_time: z.string(),
  system_mtime: z.string(),
  user_mtime: z.string(),
});

// The resource tree. Child nodes recurse indefinitely; the root node (under
// `tree._resolved`) has a few extra/missing fields relative to its children
// (no `has_children`, but a `jsonmodel_type` and optional finding aid title).
interface TreeNode {
  title: string;
  id: number;
  record_uri: string;
  publish: boolean;
  suppressed: boolean;
  node_type: string;
  level: string;
  instance_types: string[];
  has_children: boolean;
  children: TreeNode[];
  containers: unknown[];
}

const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z.object({
    title: z.string(),
    id: z.number(),
    record_uri: z.string(),
    publish: z.boolean(),
    suppressed: z.boolean(),
    node_type: z.string(),
    level: z.string(),
    instance_types: z.array(z.string()),
    has_children: z.boolean(),
    children: z.array(treeNodeSchema),
    containers: z.array(z.unknown()),
  }),
);

const treeResolvedSchema = z.object({
  title: z.string(),
  id: z.number(),
  record_uri: z.string(),
  publish: z.boolean(),
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
export const repoResourcesSchema = z.object({
  lock_version: z.number(),
  title: z.string(),
  publish: z.boolean(),
  restrictions: z.boolean(),
  suppressed: z.boolean(),
  is_slug_auto: z.boolean(),
  jsonmodel_type: z.string(),
  uri: z.string(),
  level: z.string(),
  resource_type: z.string(),
  id_0: z.string(),
  id_1: z.string(),
  id_2: z.string().optional(),
  finding_aid_title: z.string().optional(),
  finding_aid_filing_title: z.string().optional(),
  finding_aid_date: z.string().optional(),
  finding_aid_author: z.string().optional(),
  finding_aid_description_rules: z.string().optional(),
  finding_aid_language: z.string(),
  finding_aid_script: z.string(),
  finding_aid_language_note: z.string().optional(),
  finding_aid_status: z.string().optional(),
  created_by: z.string(),
  last_modified_by: z.string(),
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
  rights_statements: z.array(z.unknown()),
  linked_agents: z.array(linkedAgentSchema),
  import_previous_arks: z.array(z.unknown()),
  revision_statements: z.array(z.unknown()),
  instances: z.array(instanceSchema),
  deaccessions: z.array(z.unknown()),
  related_accessions: z.array(z.unknown()),
  classifications: z.array(classificationSchema),
  notes: z.array(noteSchema),
  metadata_rights_declarations: z.array(z.unknown()),
  repository: repositorySchema,
  tree: treeSchema,
});
