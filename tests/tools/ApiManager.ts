import {APIRequestContext, APIResponse, expect, TestInfo, TestType} from '@playwright/test';

export class ApiManager {
    private request: APIRequestContext;
    private testInfo: TestInfo;
    private test: TestType<any, any>;

    constructor(request: APIRequestContext, testInfo: TestInfo, test: TestType<any, any>) {
        this.request = request;
        this.testInfo = testInfo;
        this.test = test;
    }

    // LOW-LEVEL: Basic HTTP methods
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

    async expectResponseToBeOk(response: APIResponse): Promise<void> {
        return expect(response).toBeOK()
    }

    async attachDataToReport(description: string, data: string): Promise<void> {
        await this.testInfo.attach(description, {
            body: data,
            contentType: 'text/plain'
        })
    }

}