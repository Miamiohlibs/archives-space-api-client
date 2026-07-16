# Release Notes

## v. 0.2.2

### Fixed

- made additional fields optional in zod schemas:
  - dateSchema.begin and dateSchema.end
  - externalIdSchema.source
  - agentNameSchema.source
  - subjectResolvedSchema.source

## v. 0.2.1

### Fixed

- made created_by and last_modified_by fields optional in zod schemas, as we find them to be at least sometimes optional in the real world

## v. 0.2.0

### Added

- added support for TypeScript and Zod
- changed types to zod schemas, exporting new types derived from the schemas
- added tests using vitest
- added support for the "resolve" option when getting an ArchivesSpace API url

## v. 0.1.0

### Added

- initial build
- supports `new AspaceClient()`, `getToken()` and `getUrl()`
