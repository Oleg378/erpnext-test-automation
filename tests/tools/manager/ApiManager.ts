import {APIRequestContext, APIResponse, expect, TestInfo, TestType} from '@playwright/test';
import {ReportManager} from './ReportManager';
import {Serializable} from 'playwright-core/types/structs';

interface ApiResponse {
    body(): Promise<Buffer>;
}

export interface ApiOptions {
    enableSteps?: boolean;
    description?: string;
}

export class ApiManager extends ReportManager {
    protected request: APIRequestContext;

    constructor(request: APIRequestContext, testInfo: TestInfo, test: TestType<any, any>) {
        super(testInfo, test);
        this.request = request;
    }

    async get(
        endpoint: string,
        options: ApiOptions = {enableSteps: true}
    ): Promise<APIResponse> {
        if (!options.enableSteps) {
            return this.request.get(endpoint);
        }
        return this.withStep(options.description || `GET ${endpoint}`, () => {
            return this.request.get(endpoint);
        });
    }

    async post(
        endpoint: string,
        data: Serializable,
        options: ApiOptions = {enableSteps: true}
    ): Promise<APIResponse> {
        if (!options.enableSteps) {
            return this.request.post(endpoint, { data });
        }
        return this.withStep(options.description || `POST ${endpoint}`, async () => {
            return this.request.post(endpoint, { data });
        });
    }

    async put(
        endpoint: string,
        data: Serializable,
        options: ApiOptions = {enableSteps: true}
    ): Promise<APIResponse> {
        if (!options.enableSteps) {
            return this.request.put(endpoint, { data });
        }
        return this.withStep(`PUT ${endpoint}`, async () => {
            return this.request.put(endpoint, { data });
        });
    }

    async delete(
        endpoint: string,
        options: ApiOptions = {enableSteps: true}
    ): Promise<APIResponse> {
        if (!options.enableSteps) {
            return this.request.delete(endpoint);
        }
        return this.withStep(`DELETE ${endpoint}`, async () => {
            return this.request.delete(endpoint);
        });
    }

    async expectResponseToBeOk(response: APIResponse): Promise<void> {
        return expect(response).toBeOK()
    }

    // Helper method to process response body
    private async processResponseBody(response: ApiResponse): Promise<{
        attachmentBody: string;
        contentType: string;
    }> {
        const buffer: Buffer = await response.body();
        const textMessage: string = buffer.length === 0 ? 'Empty response body' : buffer.toString('utf-8');

        let attachmentBody: string;
        let contentType: string;

        try {
            const jsonData = JSON.parse(textMessage);
            attachmentBody = JSON.stringify(jsonData, null, 2);
            contentType = 'application/json';
        } catch {
            attachmentBody = textMessage;
            contentType = 'text/plain';
        }
        return { attachmentBody, contentType };
    }

    // Helper method for error handling
    private async handleError(error: unknown, description: string): Promise<never> {
        const err = error as Error;
        const errorDetails = {
            step: description,
            timestamp: new Date().toISOString(),
            error: err.message,
            stack: err.stack
        };

        await this.testInfo.attach('error', {
            body: JSON.stringify(errorDetails, null, 2),
            contentType: 'application/json'
        });
        throw error;
    }

    private isApiResponse(obj: any): obj is ApiResponse {
        return obj && typeof obj.body === 'function';
    }

    async withStep<T>(description: string, action: () => Promise<T>): Promise<T> {
        return await this.test.step(description, async () => {
            try {
                const response = await action();
                // Type-safe check before calling body()
                if (this.isApiResponse(response)) {
                    const { attachmentBody, contentType } = await this.processResponseBody(response);

                    await this.testInfo.attach('response', {
                        body: attachmentBody,
                        contentType: contentType
                    });
                } else {
                    await this.testInfo.attach('warning', {
                        body: `Skipping response processing - not an APIResponse. Got: ${typeof response}`,
                        contentType: 'text/plain'
                    });
                }
                return response;
            } catch (error) {
                return await this.handleError(error, description);
            }
        });
    }
}