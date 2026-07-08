import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect } from 'vitest';
import AspaceClient from '../dist/AspaceClient.js';
import { z } from 'zod';
import { repoResourcesSchema } from '../dist/schemas/repoResourcesSchema';
import { repoTopContainerSchema } from '../dist/schemas/RepoTopContainersSchema.js';
import { repoArchivalObjectSchema } from '../dist/schemas/RepoArchivalObjectsSchema.js';

const baseUrl = process.env.ASPACE_BASE_URL || '';
const username = process.env.USERNAME || '';
const password = process.env.PASSWORD || '';

describe('getUrl', () => {
  it('should get a repo/resources URL and it should parse ok', async () => {
    const client = new AspaceClient({
      baseUrl,
      username,
      password,
    });
    await client.getToken();
    console.log(`Token: ${client.token}`);
    const url =
      'https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634';
    const raw = await client.getUrl(url);
    const results = repoResourcesSchema.parse(raw);
    expect(results).toEqual(raw);
  });

  it('should get a top_containers URL and it should parse ok', async () => {
    const client = new AspaceClient({
      baseUrl,
      username,
      password,
    });
    await client.getToken();
    const url =
      'https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7836';
    const raw = await client.getUrl(url);
    const results = repoTopContainerSchema.parse(raw);
    expect(results).toEqual(raw);
  });

  it('should get a archival_objects URL and it should parse ok', async () => {
    const client = new AspaceClient({
      baseUrl,
      username,
      password,
    });
    await client.getToken();
    const url =
      'https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/5616';
    const raw = await client.getUrl(url);
    const results = repoArchivalObjectSchema.parse(raw);
    expect(results).toEqual(raw);
  });
});
