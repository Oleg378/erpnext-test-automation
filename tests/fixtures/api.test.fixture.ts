import { test as baseTest } from '@playwright/test';
import {ApiManager} from '../tools/ApiManager';


export const apiTest = baseTest.extend<{
    apiManager: ApiManager;
}>({
    apiManager: async ({ request }, use) => {
        const apiManager = new ApiManager(request);
        await use(apiManager);
    },
});