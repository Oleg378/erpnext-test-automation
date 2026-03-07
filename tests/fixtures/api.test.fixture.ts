import { test as baseTest } from '@playwright/test';
import {ApiManager} from '../managers/ApiManager';


export const apiTest = baseTest.extend<{
    apiManager: ApiManager;
}>({
    apiManager: async ({ request }, use, testInfo) => {
        const apiManager = new ApiManager(request, testInfo, baseTest);
        await use(apiManager);
    },
});