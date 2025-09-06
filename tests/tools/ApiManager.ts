import {APIRequestContext, APIResponse, expect} from '@playwright/test';

export class ApiManager {
    private request: APIRequestContext;


    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // LOW-LEVEL: Basic HTTP methods (for flexibility)
    async get(endpoint: string): Promise<APIResponse> {
        return this.request.get(endpoint);
    }

    async post(endpoint: string, data: any): Promise<APIResponse> {
        return this.request.post(endpoint, { data });
    }

    async put(endpoint: string, data: any): Promise<APIResponse> {
        return this.request.put(endpoint, { data });
    }

    async delete(endpoint: string): Promise<APIResponse> {
        return this.request.delete(endpoint);
    }

    async expectResponseToBeOk(response: APIResponse) {
        return expect(response).toBeOK()
    }

}