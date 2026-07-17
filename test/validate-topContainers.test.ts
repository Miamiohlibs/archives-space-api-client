/// <reference types="vite/client" />
import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect, vi, afterEach } from 'vitest';
// import { repoResourcesSchema } from '../dist/schemas/RepoResourcesSchema.js';
import { repoTopContainerSchema } from '../dist/schemas/RepoTopContainersSchema.js';
// import { repoArchivalObjectSchema } from '../dist/schemas/RepoArchivalObjectsSchema.js';

const knownValidResponses = import.meta.glob<{ default: unknown }>(
  './knownValidResponses/repoTopContainers/*.json',
  { eager: true },
);

describe('validate repoTopContainerSchema (unit)', () => {
  for (const [path, module] of Object.entries(knownValidResponses)) {
    const name = path.split('/').pop();
    it(`should validate against ${name}`, () => {
      const raw = module.default;
      const parsed = repoTopContainerSchema.parse(raw);
      expect(parsed).toEqual(raw);
    });
  }
});
