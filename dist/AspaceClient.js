const expectedKeys = ['baseUrl', 'username', 'password'];
export default class AspaceClient {
    baseUrl;
    username;
    password;
    token;
    user;
    constructor(params) {
        for (const key of expectedKeys) {
            const value = params[key];
            if (typeof value !== 'string') {
                throw new Error(`Option ${key} must be a string; received ${typeof value}`);
            }
            if (value.trim() === '') {
                throw new Error(`Option ${key} cannot be an empty string`);
            }
            this[key] = value.trim();
        }
    }
    async getToken() {
        const url = `${this.baseUrl}/users/${this.username}/login?password=${this.password}`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        if (response.status == 200) {
            this.token = data.session;
            this.user = data.user;
            return { success: true, token: this.token, user: this.user };
        }
        else {
            return {
                success: false,
                error: `Error ${response.status} : ${response.statusText}`,
            };
        }
    }
    async getRelativeUrl(relativeUrl) {
        try {
            const url = new URL(`${this.baseUrl}${relativeUrl}`);
            return await this.executeFetch(url);
        }
        catch (error) {
            throw error;
        }
    }
    async executeFetch(url) {
        console.log(`Requesting: ${url.toString()}, with token: ${this.token}`);
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
