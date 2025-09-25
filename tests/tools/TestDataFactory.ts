export class TestDataFactory {
    public static readonly SUPER_ADMIN_CREDENTIALS = {
        email: 'Administrator',
        password: 'admin'
    };
    public static readonly USER_FOR_SYSTEM_SETUP = {
        fullName: 'Admin Adminovich',
        email: 'adminovich@example.com',
        password: 'admin123@!'
    };
    public static readonly MAIN_COMPANY_INFO = {
        name: 'Main Test Company Inc.',
        abbreviation: 'TEST'
    };

    private constructor() {
        throw Error('TestDataFactory instances are not allowed!');
    }

    static generateBaseUsername(): string {
        return Date.now().toString()
    }

    static generateCompanyName(): string {
        const adjectives = [
            'Awesome', 'Global', 'Quantum', 'Alpha', 'Elite', 'Advanced', 'Innovative',
            'Dynamic', 'Superior', 'Digital', 'Smart', 'Precision', 'Reliable', 'Swift'
        ];

        const nouns = [
            'Tech', 'Solutions', 'Systems', 'Industries', 'Ventures', 'Technologies',
            'Services', 'Labs', 'Networks', 'Security', 'Data', 'Cloud', 'Software'
        ];

        const suffixes = [
            'Inc.', 'LLC', 'Corp.', 'Ltd.', 'and Co.', 'International'
        ];

        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        return `${adj} ${noun} ${suffix}`;
    }

    static generateCompanyAbbreviation(): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let abbreviation = '';

        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            abbreviation += letters[randomIndex];
        }

        return abbreviation;
    }
}