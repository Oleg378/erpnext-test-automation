import {Item, User} from './record-types';
import {ProfileRole} from './ProfileRoles';
import {ItemGroupEnum} from './stock-utils/ItemGroupEnum';
import {UOMEnum} from './stock-utils/UOMEnum';

export abstract class TestDataFactory {
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

    static generateUID(): string {
        return Date.now().toString()
    }

    static generateUserInfo(role: ProfileRole, username?: string): User {
        const baseUsername = TestDataFactory.generateUID();
        const finalUsername = username || `${role.role_profile_name}${baseUsername}`;
        const email = `${finalUsername.toLowerCase()}@example.com`;
        return {
            email: email,
            first_name: 'John',
            last_name: 'Smith',
            username: finalUsername,
            new_password: role.new_password,
            send_welcome_email: 0,
            role_profile_name: role.role_profile_name
        }
    }

    static generateItemInfo(
        itemGroup: ItemGroupEnum,
        uom: UOMEnum,
        itemCode?: string,
    ): Item {
        return {
            item_code: itemCode || `TEST-${TestDataFactory.generateUID()}`,
            item_name: `Test Item`,
            item_group: itemGroup,
            stock_uom: uom,
            is_stock_item: 1,
            is_purchase_item: 1
        };
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