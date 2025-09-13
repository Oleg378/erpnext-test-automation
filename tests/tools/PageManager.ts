import {Page, BrowserContext, TestInfo, TestType, Locator, expect} from '@playwright/test';

export class PageManager {
    private page: Page;
    private context: BrowserContext;
    private testInfo: TestInfo;
    private test: TestType<any, any>;

    private static readonly WAIT_MS = 10_000;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo, test: TestType<any, any>) {
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.test = test;
    }

    async init(): Promise<void> {
        await this.gotoHome();
    }

    async gotoHome(): Promise<void> {
        await this.page.goto('/');
    }

    async click(selector: string, description?: string): Promise<void> {
        await this.withStep(description || `Click on ${selector}`, async () => {
            await this.page.click(selector);
        })
    }

    // await page.fill('input[data-fieldname="item_code"]:visible', 'your_value');
    async fillInput(input: string, value: string, description?: string): Promise<void> {
        await this.test.step(description || `Fill input ${input} with "${value}"`, async () => {
            let locator: Locator = this.page.locator(input).first()
            await locator.fill(value);
            const screenshot = await locator.screenshot();
            await this.testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        });
    }

    async assertElementIsVisible(locator: string, description?: string): Promise<void> {
        await this.withStep(description || `Element ${locator} is confirmed to be visible`, async () => {
            let element: Locator = this.page.locator(locator).first();
            await expect(element).toBeVisible({timeout: PageManager.WAIT_MS});
        })
    }

    async locateElementByText(text: string): Promise<void> {
        await this.withStep(`Text ${text} is visible`, async () => {
            let locator: Locator = this.page.getByText(text).first();
            await expect(locator).toBeVisible({ timeout: PageManager.WAIT_MS });
            return locator;
        })

    }


    async wait(number: number): Promise<void> {
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





