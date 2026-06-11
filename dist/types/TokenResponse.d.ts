export type TokenResponse = {
    success: true;
    token: string;
    user: any;
    error?: never;
} | {
    success: false;
    token?: never;
    user?: never;
    error: string;
};
//# sourceMappingURL=TokenResponse.d.ts.map