import {TestInfo, TestType} from '@playwright/test';

export abstract class ReportManager {
    protected testInfo: TestInfo;
    protected test: TestType<any, any>;

    protected constructor(testInfo: TestInfo, test: TestType<any, any>) {
        this.testInfo = testInfo;
        this.test =  test;
    }

    async attachDataToReport(description: string, data: string): Promise<void> {
        await this.testInfo.attach(description, {
            body: data,
            contentType: 'text/plain'
        })
    }

    protected abstract withStep<T>(description: string, action: () => Promise<T>): Promise<T>;
}