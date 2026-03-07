import { test as baseTest } from '@playwright/test';
import { PageManager } from '../managers/PageManager';

export const uiTest = baseTest.extend<{
    pageManager: PageManager;
}>({
    pageManager: async ({ page, context, browser }, use, testInfo) => {
        const manager = new PageManager(page, context, browser, testInfo, baseTest);
        await manager.gotoHome();
        await use(manager);
    },
});