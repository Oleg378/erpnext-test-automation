import { test as baseTest } from '@playwright/test';
import {ApiManager} from '../tools/manager/ApiManager';
import {PageManager} from '../tools/manager/PageManager';

export const test =  baseTest.extend<{
    apiManager: ApiManager;
    pageManager: PageManager;
}>({
    apiManager: async ({ request }, use, testInfo) => {
        const apiManager = new ApiManager(request, testInfo, baseTest);
        await use(apiManager);
    },
    pageManager: async ({ page, context, browser }, use, testInfo) => {
        const manager = new PageManager(page, context, browser, testInfo, baseTest);
        await manager.init();
        await use(manager);
    }
})