import {Page, BrowserContext, TestInfo, TestType, Locator, expect} from '@playwright/test';
import {ReportManager} from './ReportManager';
import {SessionContext} from '../SessionContext';
import {ProfileRole} from '../ProfileRoles';
import {Browser} from 'playwright';
import {Item} from '../utils/record-types';
import {GridColEnum} from '../../app/components/GridColEnum';

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

    async gotoHome(): Promise<void> {
        await this.page.goto('/app');
    }

    async click(selector: string, description?: string): Promise<void> {
        return this.withStep(description || `Click on ${selector}`, async () => {
            await this.page.locator(selector).first().click();
        });
    }

    async fillInput(input: string, value: string, description?: string): Promise<void> {
        return this.withStep(description || `Fill input ${input} with "${value}"`,  async () => {
            const locator: Locator = this.page.locator(input).first();
            await locator.fill(value);
        });
    }

    private async fillDivInput(input: Locator, value: string): Promise<void> {
        return this.withStep(`Fill cell input with "${value}"`,  async () => {
            await input.click();
            await this.page.keyboard.press('Backspace'); // Clear existing content
            await this.page.keyboard.type(value); // Type new value
            await this.page.keyboard.press('Tab'); // Moves to next field
        });
    }

    private async assertCellText(cell: Locator, text: string): Promise<void> {
        return this.withStep(`Assert cell has text: "${text}"`, async () => {
            await expect(cell).toHaveText(text);
        });
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press('Escape', {delay: 200});
    }

    async fillDate(input: string, value: string, description?: string): Promise<void> {
        return this.withStep(description || `Fill input ${input} with "${value}"`,  async () => {
            const locator: Locator = this.page.locator(input).first();
            await locator.click();
            await locator.pressSequentially(value);
            await this.page.keyboard.press('Enter');
        });
    }

    async selectOptionByVisibleText(select: string, value: string, description?: string): Promise<void> {
        return this.withStep(description || `Select ${value} in "${select}"`, async () => {
            const locator: Locator = this.page.locator(select);
            await locator.selectOption(value);
        });
    }

    private async findCellByItemCode(item: Item, cellDataFieldName: GridColEnum): Promise<Locator> {
        return this.page.locator(`a[data-name="${item.item_code}"]`)
            .locator(`xpath=./ancestor::*[contains(@class, "grid-row")][1]//*[@data-fieldname="${cellDataFieldName}"]`).first();
    }

    gridRow = {
        fillCell: async (
            item: Item,
            cellColumnFieldName: GridColEnum,
            value: string
        ): Promise<void> => {
            const cell: Locator = await this.findCellByItemCode(item, cellColumnFieldName);
            await this.fillDivInput(cell, value);
        },
        assertCellContent: async (
            item: Item,
            cellColumnFieldName: GridColEnum,
            value: string
        ): Promise<void> => {
            const cell: Locator = await this.findCellByItemCode(item, cellColumnFieldName);
            await this.assertCellText(cell, value);
        }
    }

    async assertVisibleText(element: string, text: string, description?: string): Promise<void> {
        return this.withStep(description || `Assert text "${text}" is visible"`, async () => {
            const locator: Locator = this.page.locator(element).first();
            await expect(locator).toHaveText(text);
        });
    }

    async getVisibleText(element: string, description?: string): Promise<string> {
        return this.withStep(description || `Get text from: ${element}"`, async () => {
            const locator = this.page.locator(element).first();
            let result = await locator.textContent()
            if (!result) {
                result = '';
            }
            return result;
        });
    }

    async assertElementIsVisible(element: string, description?: string): Promise<void> {
        return this.withStep(description || `Element ${element} is confirmed to be visible`, async () => {
            const locator: Locator = this.page.locator(element).first();
            await expect(locator).toBeVisible({ timeout: PageManager.WAIT_MS });
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

    async reopenBrowser(): Promise<void> {
        await this.page.close();
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        await this.gotoHome();
    }

    protected async withStep<T>(description: string, action: () => Promise<T>): Promise<T> {
        return this.test.step(description, async () => {
            const result = await action();
            const screenshot = await this.page.screenshot();
            await this.testInfo.attach('screenshot', {
                body: screenshot,
                contentType: 'image/png'
            });
            return result;
        });
    }

    async closePage(): Promise<void> {
        await this.page.close();
    }
}