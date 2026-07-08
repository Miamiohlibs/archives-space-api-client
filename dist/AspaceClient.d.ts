import { z } from 'zod';
import { tokenResponseSchema } from './schemas/TokenResponseSchema.js';
type TokenResponse = z.infer<typeof tokenResponseSchema>;
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
    getUrl(urlString: string): Promise<any>;
    executeFetch(url: URL): Promise<any>;
}
export {};
//# sourceMappingURL=AspaceClient.d.ts.map