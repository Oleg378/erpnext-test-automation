import {ApiManager} from '../../tools/ApiManager';
import {ProfileRole} from '../../tools/ProfileRoles';

export class ApiUtils {

    static async getAdminCookies(apiManager: ApiManager) {
        const data = {
            'usr': 'Administrator',
            'pwd': 'admin'
        }
        await apiManager.post('/api/method/login', data);
    }

    static async getListOfCustomers(apiManager: ApiManager) {
        const response = await apiManager.get('/api/resource/Customer');
        await apiManager.expectResponseToBeOk(response);
    }

    static async generateUsername(): Promise<string> {
        return Date.now().toString()
    }

    static async postCreateNewUser(apiManager: ApiManager, profileRole: ProfileRole, username?: string): Promise<string>  {
        await ApiUtils.getAdminCookies(apiManager)
        const baseUsername = username || await ApiUtils.generateUsername();
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