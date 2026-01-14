import { defineConfig } from '@playwright/test';

export default defineConfig({
    timeout: 120000,
    testDir: './tests',
    fullyParallel: true,
    retries: 0,
    workers: 4,
    reporter: [
        ['line'], // keep default console output
        ['allure-playwright']
    ],
    use: {
        headless: process.env.HEADLESS !== 'false',
        viewport: { width: 1280, height: 720 },
        trace: 'on', // 'retain-on-failure
        baseURL: process.env.BASE_URL || 'http://localhost:8081/',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
});
