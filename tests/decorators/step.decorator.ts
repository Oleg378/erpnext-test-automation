/**
 * Step Decorator for Playwright Tests.
 *
 * @param description - The step description shown in reports
 * @remarks
 * The decorator finds test context from:
 * 1. Method arguments (ApiManager.test or PageManager.test)
 * 2. Instance's pageManager property
 *
 * If no test context is found, the method executes normally (no step wrapping).
 */

export function Step(description: string) {
    return function (
        originalMethod: Function,
        context: ClassMethodDecoratorContext
    ) {
        if (context.kind !== 'method') return;

        return async function (this: any, ...args: any[]) {
            let testContext =
                args.find(a => a?.test?.step)?.test ??
                this?.pageManager?.test;

            if (!testContext) {
                return originalMethod.apply(this, args);
            }

            return testContext.step(description, async () => {
                return await originalMethod.apply(this, args);
            });
        };
    };
}