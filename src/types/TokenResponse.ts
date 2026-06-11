export type TokenResponse =
  | { success: true; token: string; user: any; error?: never }
  | { success: false; token?: never; user?: never; error: string };
