import type { TokenResponse } from './types/TokenResponse.ts';

const expectedKeys = ['baseUrl', 'username', 'password'] as const;
type ExpectedKey = (typeof expectedKeys)[number];

interface ClientParams {
  baseUrl: string;
  username: string;
  password: string;
}

export default class AspaceClient {
  baseUrl!: string;
  username!: string;
  password!: string;
  token!: string;
  user!: any;

  constructor(params: ClientParams) {
    for (const key of expectedKeys) {
      const value = params[key];

      if (typeof value !== 'string') {
        throw new Error(
          `Option ${key} must be a string; received ${typeof value}`,
        );
      }

      if (value.trim() === '') {
        throw new Error(`Option ${key} cannot be an empty string`);
      }

      this[key] = value.trim();
    }
  }

  async getToken(): Promise<TokenResponse> {
    const url = `${this.baseUrl}/users/${this.username}/login?password=${this.password}`;
    const response = await fetch(url, { method: 'POST' });

    const contentType = response.headers.get('content-type');

    // handle non-json responses
    if (contentType != 'application/json') {
      return {
        success: false,
        error: { status: response.status, message: response.statusText },
      };
    }

    const data = await response.json();

    if (response.status == 200) {
      this.token = data.session;
      this.user = data.user;
      return { success: true, token: this.token, user: this.user };
    } else {
      return {
        success: false,
        error: { status: response.status, message: response.statusText },
      };
    }
  }

  async getUrl(urlString: String) {
    try {
      // if it's a full URL, request it
      if (urlString.startsWith(this.baseUrl)) {
        return await this.executeFetch(new URL(`${urlString}`));
      } else {
        // else append the baseURL
        return await this.executeFetch(new URL(`${this.baseUrl}${urlString}`));
      }
    } catch (error) {
      throw error;
    }
  }

  async executeFetch(url: URL) {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-ArchivesSpace-Session': this.token,
      },
    });

    if (!response.ok) {
      const resString = JSON.stringify(response, null, 2);
      throw new Error(`Network response was not ok: (${resString})`);
    }

    const data = await response.json();
    return data;
  }
}
