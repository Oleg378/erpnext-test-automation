import {ApiManager} from '../../tools/manager/ApiManager';
import {ProfileRole} from '../../tools/ProfileRoles';
import {TestDataFactory} from '../../tools/TestDataFactory';
import { z } from 'zod';
import {ItemGroupEnum} from '../../tools/stock-utils/ItemGroupEnum';
import {UOMEnum} from '../../tools/stock-utils/UOMEnum';

export interface Customer {
    customer_name: string,
    customer_type: string
}

export interface Item {
    item_code: string, // uid, in the
    item_name: string,
    item_group: ItemGroupEnum,
    stock_uom: UOMEnum
}

export abstract class ApiClient {
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
    static async postCreateNewCustomer(
        customer_name: string = '',
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Customer> {
        const final_name: string = customer_name.length === 0 ? `Customer${TestDataFactory.generateBaseUsername()}` : customer_name;
        const data: Customer = {
            customer_name: final_name,
            customer_type: 'Company' // should be enum
        }
        const responseSchema = z.object({
            data: z.object({
                name: z.string(),
                customer_name: z.string(),
                customer_type: z.string(),
                doctype: z.string(),
            })
        });
        const response = await apiManager.post(
            '/api/resource/Customer',
            data,
            {enableSteps: enableSteps, description: 'Create a new Customer'}
        );
        await apiManager.expectResponseToBeOk(response);
        const parsedData = responseSchema.parse(await response.json())
        const customer: Customer = {customer_name: parsedData.data.customer_name, customer_type: parsedData.data.customer_type};
        await apiManager.attachDataToReport('list of customers:', JSON.stringify(customer))
        return customer;
    }

    static async postCreateNewItem(
        item: Item,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Item> {
        const data = {
            item_code: item.item_code,
            item_name: item.item_name,
            item_group: item.item_group,
            stock_uom: item.stock_uom,
            is_stock_item: 1,
            is_purchase_item: 1
        }
        const response = await apiManager.post(
            '/api/resource/Item',
            data,
            {enableSteps: enableSteps, description: 'Create a new Item'}
        );
        await apiManager.expectResponseToBeOk(response);
        await apiManager.attachDataToReport('New item has been created: ', JSON.stringify(item))
        return item;
    }

    private static async getAllRecords(
        endpoint: string,
        recordName: string,
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
            endpoint,
            {enableSteps: enableSteps, description: `Get a list of all ${recordName}`}
        );
        await apiManager.expectResponseToBeOk(response);
        const parsedData = responseSchema.parse(await response.json())
        const listOfRecords: string[] = parsedData.data.map(record => record.name);
        await apiManager.attachDataToReport(`list of ${recordName}:`, JSON.stringify(listOfRecords))
        return listOfRecords;
    }

    static async getListOfCompanies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return ApiClient.getAllRecords(
            '/api/resource/Company',
            'Companies',
            apiManager,
            enableSteps);
    }

    static async getListOfCustomers(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return ApiClient.getAllRecords(
            '/api/resource/Customer',
            'Customers',
            apiManager,
            enableSteps
        );
    }

    static async getListOfItems(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return ApiClient.getAllRecords(
            '/api/resource/Item',
            'Items',
            apiManager,
            enableSteps
        );
    }
}