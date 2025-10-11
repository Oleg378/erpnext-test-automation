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

    async fillInput(input: string | Locator, value: string, description?: string): Promise<void> {
        return this.withStep(description || `Fill input ${input} with "${value}"`,  async () => {
            const locator = this.ensureIsLocator(input);

            // there are input cells in the grid, but they are type of <div>; this 'if - else' dedicated to solve this problem:
            const isDiv = await locator.evaluate(el => el.tagName === 'DIV');
            if (isDiv) {
                await locator.click();
                await this.page.keyboard.press('Backspace'); // Clear existing content
                await this.page.keyboard.type(value); // Type new value
                await this.page.keyboard.press('Tab'); // Moves to next field
            } else {
                await locator.fill(value);
            }
        })
    }

    async selectOptionByVisibleText(select: string, value: string, description?: string): Promise<void> {
        return this.test.step(description || `Select ${value} in "${select}"`, async () => {
            const locator: Locator = this.page.locator(select);
            await locator.selectOption(value);
            const screenshot = await locator.screenshot();
            await this.testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        })
    }

    private async findCellByItemCode(item: Item, cellDataFieldName: GridColEnum): Promise<Locator> {
        return this.page.locator(`a[data-name="${item.item_code}"]`)
            .locator(`xpath=./ancestor::*[contains(@class, "grid-row")][1]//*[@data-fieldname="${cellDataFieldName}"]`).first();
    }

    gridRow = {
        interactWithCell: async (
            item: Item,
            cellColumnFieldName: GridColEnum,
            // you can use assertVisibleText() or fillInput() as params for interactWithCell()
            interaction: (element: Locator, text: string) => Promise<void>,
            textForInteraction: string
        ): Promise<void> => {
            const cell: Locator = await this.findCellByItemCode(item, cellColumnFieldName);
            await interaction(cell, textForInteraction);
        }
    }

    async assertVisibleText(element: string | Locator, text: string, description?: string): Promise<void> {
        return this.withStep(description || `Assert: ${text} in "${text}"`, async () => {
            const locator = this.ensureIsLocator(element);
            await expect(locator).toHaveText(text);
        })
    }

    async getVisibleText(element: string, description?: string): Promise<string> {
        return this.withStep(description || `Get text from: ${element}"`, async () => {
            const locator = this.ensureIsLocator(element);
            let result = await locator.textContent()
            if (!result) {
                result = '';
            }
            return result;
        })
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

    private ensureIsLocator(locator: string | Locator): Locator {
        let result: Locator;
        if (typeof locator === 'string') {
            result = this.page.locator(locator);
        } else {
            result = locator;
        }
        return result;
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