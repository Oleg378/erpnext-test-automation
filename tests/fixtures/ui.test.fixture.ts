import { test as baseTest } from '@playwright/test';
import { PageManager } from '../tools/PageManager';

export const uiTest = baseTest.extend<{
    pageManager: PageManager;
}>({
    pageManager: async ({ page, context }, use, testInfo) => {
        const manager = new PageManager(page, context, testInfo, baseTest);
        await manager.init();
        await use(manager);
    },
});