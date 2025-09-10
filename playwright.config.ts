import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 0,
    workers: 4,
    reporter: [
        ['line'], // keep default console output
        ['allure-playwright']
    ],
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        trace: 'on', // 'retain-on-failure
        baseURL: 'http://localhost:8081/',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox',
                },
        }
    ],
});
