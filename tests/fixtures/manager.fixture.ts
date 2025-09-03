import { test as baseTest, expect } from '@playwright/test';
import { PageManager } from '../tools/PageManager';

export const test = baseTest.extend<{
    manager: PageManager;
}>({
    manager: async ({ page, context, request }, use, testInfo) => {
        // Pass baseTest as the 'test' parameter
        const manager = new PageManager(page, context, request, testInfo, baseTest);
        await manager.init();
        await use(manager);
    },
});

// export { expect };