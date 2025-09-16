import {ApiManager} from '../../tools/manager/ApiManager';
import {ProfileRole} from '../../tools/ProfileRoles';
import {TestDataFactory} from '../../tools/TestDataFactory';

export class ApiClient {
    private constructor() {
        throw Error('ApiClient instances are not allowed!');
    }

    static async postRetrieveAdminCookies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<void> {
        const data = {
            usr: 'Administrator',
            pwd: 'admin'
        }
        await apiManager.post(
            '/api/method/login',
            data, 'Retrieve admin data',
            enableSteps);
    }

    static async getListOfCustomers(
        apiManager: ApiManager
    ): Promise<void> {
        const response = await apiManager.get('/api/resource/Customer');
        await apiManager.expectResponseToBeOk(response);
        const buffer: Buffer = await response.body();
        const responseBody: string = buffer.toString('utf-8');
        await apiManager.attachDataToReport('Existing customers: ', responseBody)
    }

    static async postCreateNewUser(
        apiManager: ApiManager,
        profileRole: ProfileRole,
        enableSteps: boolean = true,
        username?: string
    ): Promise<string>  {
        const baseUsername = username || await TestDataFactory.generateUsername();
        const finalUsername = `${profileRole.role_profile_name}${baseUsername}`;
        const email = `${finalUsername}@example.com`;
        const data = {
            email: email,
            first_name: 'John',
            last_name: 'Smith',
            username: finalUsername,
            new_password: profileRole.new_password,
            send_welcome_email: 0,
            role_profile_name: profileRole.role_profile_name
        };
        const response = await apiManager.post(
            '/api/resource/User',
            data,
            `Create a new user: ${email}`, enableSteps);
        await apiManager.expectResponseToBeOk(response);
        return email;
    }
}