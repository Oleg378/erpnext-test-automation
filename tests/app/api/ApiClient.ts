import {ApiManager} from '../../tools/manager/ApiManager';
import {ProfileRole} from '../../tools/ProfileRoles';
import {TestDataFactory} from '../../tools/TestDataFactory';
import { z } from 'zod';

export class ApiClient {
    private constructor() {
        throw Error('ApiClient instances are not allowed!');
    }

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
            {enableSteps: enableSteps, description: 'Retrieve admin token'});
    }

    static async postCreateNewUser(
        apiManager: ApiManager,
        profileRole: ProfileRole,
        enableSteps: boolean = true,
        username?: string
    ): Promise<string>  {
        const baseUsername = TestDataFactory.generateBaseUsername();
        const finalUsername = username || `${profileRole.role_profile_name}${baseUsername}`;
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
            {enableSteps: enableSteps, description: `Get or Create a new user: ${email}`}
        );
        if (response.status() === 409) {
            await apiManager.attachDataToReport(`User already exists!`, email);
            return email;
        }
        await apiManager.expectResponseToBeOk(response);
        await apiManager.attachDataToReport(`New user with profileRole ${data.role_profile_name} has been created!`, email);
        return email;
    }

    static async postCreateNewCompany(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<{company_name: string, abbr: string, default_currency: string, country: string}> {
        const data = {
            company_name: TestDataFactory.generateCompanyName(),
            abbr: TestDataFactory.generateCompanyAbbreviation(),
            default_currency: 'ILS', // should be enum
            country: 'Israel' // should be enum
        }
        const response = await apiManager.post(
            '/api/resource/Company',
            data,
            {enableSteps: enableSteps, description: 'Create a new company'});
        await apiManager.expectResponseToBeOk(response);
        return data;
    }

    static async getListOfCompanies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        const responseSchema = z.object({
            data: z.array(
                z.object({
                    name: z.string()
                })
            )
        });
        const response = await apiManager.get(
            '/api/resource/Company',
            {enableSteps: enableSteps, description: 'Get a list of all companies'}
        );
        await apiManager.expectResponseToBeOk(response);
        const parsedData = responseSchema.parse(await response.json())
        const listOfCompanies: string[] = parsedData.data.map(company => company.name);
        await apiManager.attachDataToReport('list of companies:', listOfCompanies.toString())
        return listOfCompanies;
    }

    static async getListOfCustomers(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        const responseSchema = z.object({
            data: z.array(
                z.object({
                    name: z.string()
                })
            )
        });
        const response = await apiManager.get(
            '/api/resource/Customer',
            {enableSteps: enableSteps, description: 'Get a list of all customers'}
        );
        await apiManager.expectResponseToBeOk(response);
        const parsedData = responseSchema.parse(await response.json())
        const listOfCustomers: string[] = parsedData.data.map(customer => customer.name);
        await apiManager.attachDataToReport('list of companies:', listOfCustomers.toString())
        return listOfCustomers;
    }
}