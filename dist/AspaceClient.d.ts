import type { TokenResponse } from './types/TokenResponse.ts';
interface ClientParams {
    baseUrl: string;
    username: string;
    password: string;
}
export default class AspaceClient {
    baseUrl: string;
    username: string;
    password: string;
    token: string;
    user: any;
    constructor(params: ClientParams);
    getToken(): Promise<TokenResponse>;
    getRelativeUrl(relativeUrl: String): Promise<any>;
    executeFetch(url: URL): Promise<any>;
}
export {};
//# sourceMappingURL=AspaceClient.d.ts.map