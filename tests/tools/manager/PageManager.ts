import {Page, BrowserContext, TestInfo, TestType, Locator, expect} from '@playwright/test';
import {ReportManager} from './ReportManager';
import {SessionContext} from '../SessionContext';
import {ProfileRole} from '../ProfileRoles';
import {Browser} from 'playwright';

export class PageManager extends ReportManager {
    protected page: Page;
    protected context: BrowserContext;
    protected browser: Browser;
    private static readonly WAIT_MS = 30_000;

    constructor(page: Page, context: BrowserContext, browser: Browser, testInfo: TestInfo, test: TestType<any, any>) {
        super(testInfo, test);
        this.page = page;
        this.context = context;
        this.browser = browser;
        this.testInfo = testInfo;
        this.test = test;
    }

    async init(): Promise<void> {
        await this.gotoHome();
    }

    async gotoHome(): Promise<void> {
        await this.page.goto('/app');
    }

    async click(selector: string, description?: string): Promise<void> {
        return this.withStep(description || `Click on ${selector}`, async () => {
            await this.page.click(selector);
        });
    }

    async fillInput(input: string, value: string, description?: string): Promise<void> {
        return this.test.step(description || `Fill input ${input} with "${value}"`, async () => {
            const locator: Locator = this.page.locator(input).first();
            await locator.fill(value);
            const screenshot = await locator.screenshot();
            await this.testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        });
    }

    async assertElementIsVisible(locator: string, description?: string): Promise<void> {
        return this.withStep(description || `Element ${locator} is confirmed to be visible`, async () => {
            const element: Locator = this.page.locator(locator).first();
            await expect(element).toBeVisible({ timeout: PageManager.WAIT_MS });
        });
    }

    async locateElementByText(text: string): Promise<Locator> {
        return this.withStep(`Text ${text} is visible`, async () => {
            const locator: Locator = this.page.getByText(text).first();
            await expect(locator).toBeVisible({ timeout: PageManager.WAIT_MS });
            return locator;
        });
    }

    async wait(number: number): Promise<void> {
        await this.page.waitForTimeout(number);
    }

    async generateSessionContext(userRole: ProfileRole): Promise<SessionContext> {
        return new SessionContext(
            userRole,
            await this.context.storageState({indexedDB: true})
        );
    }

    async restoreBrowserContext(context: SessionContext): Promise<void> {
        await this.page.close();
        this.context = await this.browser.newContext({storageState: context.storageState });
        this.page = await this.context.newPage();
        await this.gotoHome();
    }

    async close() {
        if (this.context) {
            await this.page.close();
            await this.context.close();
        }
    }

    async withStep<T>(description: string, action: () => Promise<T>): Promise<T> {
        return this.test.step(description, async () => {
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