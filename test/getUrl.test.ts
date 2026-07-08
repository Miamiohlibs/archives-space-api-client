import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect, vi, afterEach } from 'vitest';
import AspaceClient from '../dist/AspaceClient.js';
import { z } from 'zod';
import { repoResourcesSchema } from '../dist/schemas/repoResourcesSchema';
import { repoTopContainerSchema } from '../dist/schemas/RepoTopContainersSchema.js';
import { repoArchivalObjectSchema } from '../dist/schemas/RepoArchivalObjectsSchema.js';

const baseUrl = process.env.ASPACE_BASE_URL || '';
const username = process.env.USERNAME || '';
const password = process.env.PASSWORD || '';

describe('getUrl (unit, mocked executeFetch)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes the full URL through unchanged when urlString already starts with baseUrl', async () => {
    const client = new AspaceClient({
      baseUrl: 'https://example.com/api',
      username: 'user',
      password: 'pass',
    });

    const executeFetchSpy = vi
      .spyOn(client, 'executeFetch')
      .mockResolvedValue({ ok: true });

    const fullUrl = 'https://example.com/api/repositories/2/resources/634';
    await client.getUrl(fullUrl);

    expect(executeFetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = executeFetchSpy.mock.calls[0][0];
    expect(calledUrl).toBeInstanceOf(URL);
    expect(calledUrl.toString()).toBe(fullUrl);
  });

  it('prefixes baseUrl when given a relative path', async () => {
    const client = new AspaceClient({
      baseUrl: 'https://example.com/api',
      username: 'user',
      password: 'pass',
    });

    const executeFetchSpy = vi
      .spyOn(client, 'executeFetch')
      .mockResolvedValue({ ok: true });

    await client.getUrl('/repositories/2/resources/634');

    expect(executeFetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = executeFetchSpy.mock.calls[0][0];
    expect(calledUrl.toString()).toBe(
      'https://example.com/api/repositories/2/resources/634',
    );
  });

  it('should accept an array of "resolve" params and serialize them in the url', async () => {
    const client = new AspaceClient({
      baseUrl: 'https://example.com/api',
      username: 'user',
      password: 'pass',
    });

    const executeFetchSpy = vi
      .spyOn(client, 'executeFetch')
      .mockResolvedValue({ ok: true });

    const fullUrl = 'https://example.com/api/repositories/2/resources/634';
    const fullUrlWithParams =
      'https://example.com/api/repositories/2/resources/634?resolve%5B%5D=subjects&resolve%5B%5D=repository';
    const options = { resolve: ['subjects', 'repository'] };
    await client.getUrl(fullUrl, options);

    expect(executeFetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = executeFetchSpy.mock.calls[0][0];
    expect(calledUrl).toBeInstanceOf(URL);
    expect(calledUrl.toString()).toBe(fullUrlWithParams);
  });
});

describe('getUrl (live/async, tested against Miami University endpoints, vpn required', () => {
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
