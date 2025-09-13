export class TestDataFactory {
    private constructor() {
        throw Error('TestDataFactory instances are not allowed!');
    }

    static async generateUsername(): Promise<string> {
        return Date.now().toString()
    }
}