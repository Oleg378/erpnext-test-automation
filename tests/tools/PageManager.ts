import {Page, BrowserContext, APIRequestContext, TestInfo, TestType, expect} from '@playwright/test';
import {Locator} from "playwright-core";

export class PageManager {
    private page: Page;
    private context: BrowserContext;
    private request: APIRequestContext;
    private testInfo: TestInfo;
    private test: TestType<any, any>;

    private static readonly WAIT_MS = 10_000;

    constructor(page: Page, context: BrowserContext, request: APIRequestContext, testInfo: TestInfo, test: TestType<any, any>) {
        this.page = page;
        this.context = context;
        this.request = request;
        this.testInfo = testInfo;
        this.test = test;
    }

    async init() {
        await this.gotoHome();
    }

    async gotoHome() {
        await this.page.goto('http://localhost:8081/');
    }

    async click(selector: string, description?: string) {
        await this.withStep(description || `Click on ${selector}`, async () => {
            await this.page.click(selector);
        })
    }

    // await page.fill('input[data-fieldname="item_code"]:visible', 'your_value');
    async fillInput(input: string, value: string, description?: string) {
        await this.test.step(description || `Fill input ${input} with "${value}"`, async () => {
            let locator: Locator = this.page.locator(input).first()
            await locator.fill(value);
            const screenshot = await locator.screenshot();
            await this.testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        });
    }

    async assertElementIsVisible(locator: string, description?: string) {
        await this.withStep(description || `Element ${locator} is confirmed to be visible`, async () => {
            let element: Locator = this.page.locator(locator).first();
            await expect(element).toBeVisible({timeout: PageManager.WAIT_MS});
        })
    }

    async locateElementByText(text: string) {
        await this.withStep(`Text ${text} is visible`, async () => {
            let locator: Locator = this.page.getByText(text).first();
            await expect(locator).toBeVisible({ timeout: PageManager.WAIT_MS });
            return locator;
        })

    }


    async wait(number: number) {
        await this.page.waitForTimeout(number)
    }


    async withStep<T>(description: string, action: () => Promise<T>): Promise<T> {
        return await this.test.step(description, async () => {
            try {
                const result = await action();
                const screenshot = await this.page.screenshot();
                await this.testInfo.attach('screenshot', {
                    body: screenshot,
                    contentType: 'image/png'
                });
                return result;
            } catch (error) {
                const screenshot = await this.page.screenshot();
                await this.testInfo.attach('error-screenshot', {
                    body: screenshot,
                    contentType: 'image/png'
                });
                throw error;
            }
        });
    }
}





