import {APIRequestContext, APIResponse, expect, TestInfo, TestType} from '@playwright/test';
import {ReportManager} from './ReportManager';
import {Serializable} from 'playwright-core/types/structs';
import {z} from 'zod';

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
            return this.request.get(endpoint, { params: { limit: 1000 } });
        }
        return this.withStep(options.description || `GET ${endpoint}`, () => {
            return this.request.get(endpoint, { params: { limit: 1000 } });
        });
    }

    async getAllRecords(
        endpoint: string,
        recordName: string,
        enableSteps: boolean = true
    ): Promise<string[]> {
        const responseSchema = z.object({
            data: z.array(
                z.object({
                    name: z.string()
                })
            )
        });
        const response = await this.get(
            endpoint,
            {enableSteps: enableSteps, description: `Get a list of all ${recordName}`}
        );
        await this.expectResponseToBeOk(response);
        const parsedData = responseSchema.parse(await response.json())
        return parsedData.data.map(record => record.name);
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

    async postCreateRecord<T>(
        endpoint: string,
        recordName: string,
        record: T,
        enableSteps: boolean = true
    ): Promise<{ request_body: T; response_body: Serializable }> {
        const response = await this.post(
            endpoint,
            record,
            { enableSteps, description: `Create a new ${recordName}` }
        );
        await this.expectResponseToBeOk(response);
        const responseBody = await response.json();
        return { request_body: record, response_body: responseBody };
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

    async putUpdateRecord<T>(
        endpoint: string,
        recordName: string,
        record: T,
        enableSteps: boolean = true
    ): Promise<{ request_body: T; response_body: Serializable }> {
        const response = await this.put(
            endpoint,
            record,
            { enableSteps, description: `Update ${recordName}` }
        );
        await this.expectResponseToBeOk(response);
        const responseBody = await response.json();
        return { request_body: record, response_body: responseBody };
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
        return expect(response, 'Response Code should be 200-299').toBeOK()
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