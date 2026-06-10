import type { TokenResponse } from './types/TokenResponse';

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
    const data = await response.json();

    if (response.status == 200) {
      return { success: true, token: data.session, user: data.user };
    } else {
      return {
        success: false,
        error: `Error ${response.status} : ${response.statusText}`,
      };
    }
  }
}
