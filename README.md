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

#### getUrl

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
