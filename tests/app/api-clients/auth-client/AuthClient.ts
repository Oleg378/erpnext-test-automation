import {ApiManager} from '../../../managers/ApiManager';
import {TestDataFactory} from '../../data/TestDataFactory';

export abstract class AuthClient {
    static async postRetrieveAdminCookies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<void> {
        const data = {
            usr: TestDataFactory.SUPER_ADMIN_CREDENTIALS.email,
            pwd: TestDataFactory.SUPER_ADMIN_CREDENTIALS.password
        }
        await apiManager.post(
            '/api/method/login',
            data,
            {enableSteps: enableSteps, description: 'Retrieve admin token'}
        );
    }
}