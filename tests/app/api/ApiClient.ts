import {ApiManager} from '../../tools/ApiManager';
import {ProfileRole} from '../../tools/ProfileRoles';
import {TestDataFactory} from '../../tools/TestDataFactory';

export class ApiClient {
    private constructor() {
        throw Error('ApiClient instances are not allowed!');
    }

    static async postRetrieveAdminCookies(apiManager: ApiManager): Promise<void> {
        const data = {
            'usr': 'Administrator',
            'pwd': 'admin'
        }
        await apiManager.post('/api/method/login', data);
    }

    static async getListOfCustomers(apiManager: ApiManager): Promise<void> {
        const response = await apiManager.get('/api/resource/Customer');
        await apiManager.expectResponseToBeOk(response);
        const buffer: Buffer = await response.body();
        const responseBody: string = buffer.toString('utf-8');
        await apiManager.attachDataToReport('Existing customers: ', responseBody)
    }

    static async postCreateNewUser(apiManager: ApiManager, profileRole: ProfileRole, username?: string): Promise<string>  {
        const baseUsername = username || await TestDataFactory.generateUsername();
        const finalUsername = `${profileRole.role_profile_name}${baseUsername}`;
        const data = {
            email: `${finalUsername}@example.com`,
            first_name: 'John',
            last_name: 'Smith',
            username: finalUsername,
            new_password: profileRole.new_password,
            send_welcome_email: 0,
            role_profile_name: profileRole.role_profile_name
        };
        const response = await apiManager.post('/api/resource/User', data);
        await apiManager.expectResponseToBeOk(response);
        return finalUsername;
    }
}