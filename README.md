## archives-space-api-client

''archives-space-api-client'' is a read-only API client for ArchivesSpace API.

### Requirements

You will need an ArchivesSpace username and password key with bib permissions to use this. You will also need to know the base url of your ArchivesSpace API (usually something like either https://archivesspace.your.org/api or https://archivesspace.your.org:8089)

### Installation

```
npm install @kenxirwin/archives-space-api-client
```

### Usage

#### Importing

```
import { AspaceClient } from '@kenxirwin/archives-space-api-client';
import type { TokenResponse } from '@kenxirwin/archives-space-api-client';
```

#### Initializing Client and getting a Token

To set up the API connection, initialize the client and get a token:

```
const client = new AspaceClient({ baseUrl, username, password });
const authResponse: TokenResponse = await client.getToken();
```

#### getUrl (urlString: string, options?: { resolve: string[] })

You can make a GET request from the API using either a fully qualified URL or
a relative url that will be automatically appended to the base URL with which
you initialized the client. Examples:

```
  const urlString = 'https://aspace.your.org/api/repositories/2/resources/634';
  const queryResponse: any = await client.getUrl(urlString);
```

or

```
  const urlString = '/api/repositories/2/resources/634';
  const queryResponse: any = await client.getUrl(urlString);
```

The `queryResponse` will be the parsed JSON from the API.

ArchivesSpace API results include many references to additional endpoints; those endpoints may be "resolved" by requesting that the API resolve one or more attributes. A request to getUrl takes an optional second argument; you can pass one or more options to be resolved as an array like this, which will resolve the "container_locations" and "repository" attributes:

```
const queryResponse: any = await client.getUrl(urlString, {
    resolve: ['container_locations', 'repository'],
  });
```

#### Parsing results with Zod schemas

This module exports three Zod schemas for parsing/validating API results:

- `repoResourcesSchema`: for endpoints like /repositories/2/resources/634
- `repoTopContainerSchema`: for endpoints like /repositories/2/top_containers/7838
- `repoArchivalObjectSchema`: for endpoints like /repositories/2/archival_objects/5616

Example usage:

```
import { repoTopContainersSchema } from '@kenxirwin/archives-space-api-clients';
const client = new AspaceClient({ baseUrl, username, password });
await client.getToken();

try {
  const urlString = 'https://aspace.your.org/api/repositories/2/top_containers/7838';
  const queryResponse: any = await client.getUrl(urlString);
  const validatedResponse = repoTopContainersSchema.parse(urlString);
} catch (error) {
  console.error(error.message)
}
```
