import {ApiManager} from '../../tools/manager/ApiManager';
import {TestDataFactory} from '../../tools/TestDataFactory';
import {expect} from '@playwright/test';
import {
    Company,
    COMPANY_RESPONSE_SCHEMA,
    Customer,
    CUSTOMER_RESPONSE_SCHEMA,
    Item,
    ITEM_RESPONSE_SCHEMA,
    Supplier,
    SUPPLIER_RESPONSE_SCHEMA,
    User,
    USER_RESPONSE_SCHEMA
} from '../../tools/record-types';

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
        user: User,
        apiManager: ApiManager,
        enableSteps: boolean = true,
    ): Promise<User>  {
        const result = await apiManager.postCreateRecord(
            '/api/resource/User',
            'User',
            user,
            enableSteps
        )
        const parsedResponse = USER_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "email"'
        ).toBe(parsedResponse.data.email);
        expect(
            parsedResponse.data.first_name,
            `"first_name" should equal "${result.request_body.first_name}"`
        ).toBe(result.request_body.first_name);
        expect(
            parsedResponse.data.last_name,
            `"last_name" should equal "${result.request_body.last_name}"`
        ).toBe(result.request_body.last_name);
        expect(
            parsedResponse.data.role_profile_name,
            `"role_profile_name" should equal "${result.request_body.role_profile_name}"`
        ).toBe(result.request_body.role_profile_name);

        return user;
    }

    static async postCreateNewCompany(
        company: Company,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Company> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Company',
            'Company',
            company,
            enableSteps
        );
        const parsedResponse = COMPANY_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "company_name"'
        ).toBe(parsedResponse.data.company_name);
        expect(
            parsedResponse.data.company_name,
            `"company_name" should equal "${result.request_body.company_name}"`
        ).toBe(result.request_body.company_name);
        expect(
            parsedResponse.data.abbr,
            `"abbr" should equal "${result.request_body.abbr}"`
        ).toBe(result.request_body.abbr);

        return company;
    }

    static async postCreateNewCustomer(
        customer: Customer,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Customer> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Customer',
            'Customer',
            customer,
            enableSteps
        );
        const parsedResponse = CUSTOMER_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "customer_name"'
        ).toBe(parsedResponse.data.customer_name)
        expect(
            parsedResponse.data.customer_name,
            `"customer_name" should equal "${result.request_body.customer_name}"`
        ).toBe(result.request_body.customer_name)
        expect(
            parsedResponse.data.customer_type,
            `"supplier_type" should be "${result.request_body.customer_type}"`
        ).toBe(result.request_body.customer_type);

        return  customer;
    }

    static async postCreateNewItem(
        item: Item,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Item> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Item',
            'Item',
            item,
            enableSteps
        );
        const parsedResponse = ITEM_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "item_code"'
        ).toBe(parsedResponse.data.item_code);
        expect(
            parsedResponse.data.item_code,
            `"item_code" should be ${result.request_body.item_code}`
        ).toBe(result.request_body.item_code);
        expect(
            parsedResponse.data.item_name,
            `"item_name" should be ${result.request_body.item_name}`
        ).toBe(result.request_body.item_name);
        expect(
            parsedResponse.data.item_group,
            `"item_group" should be ${result.request_body.item_group}`
        ).toBe(result.request_body.item_group);
        expect(
            parsedResponse.data.stock_uom,
            `"stock_uom" should be ${result.request_body.stock_uom}`
        ).toBe(result.request_body.stock_uom);

        return item;
    }

    static async postCreateNewSupplier(
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Supplier> {
        const result = await apiManager.postCreateRecord(
             '/api/resource/Supplier',
             'Supplier',
             supplier,
            enableSteps
        );
        const parsedResponse = SUPPLIER_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.supplier_name,
            `"supplier_name" should be "${result.request_body.supplier_name}"`
        ).toBe(result.request_body.supplier_name);
        expect(
            parsedResponse.data.name,
            '"name" should equal "supplier_name"'
        ).toBe(result.request_body.supplier_name);
        expect(
            parsedResponse.data.supplier_type,
            '"supplier_type" should be "Company"'
        ).toBe('Company');

        return result.request_body;
    }

    static async getListOfCompanies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/Company',
            'Companies',
            enableSteps);
    }

    static async getListOfCustomers(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/Customer',
            'Customers',
            enableSteps
        );
    }

    static async getListOfItems(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/Item',
            'Items',
            enableSteps
        );
    }

    static async getListOfSuppliers(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/Supplier',
            'Suppliers',
            enableSteps
        );
    }

    static async getListOfUsers(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/User',
            'Users',
            enableSteps
        );
    }

    static async putUpdateItemSupplier(
        item: Item,
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true): Promise<Item> {
        const record = {
            supplier_items: [
                {
                    supplier: supplier.supplier_name
                }
            ]
        }
        const result = await apiManager.putUpdateRecord(`/api/resource/Item/${item.item_code}`, item.item_code, record, enableSteps);
        const parsedResponse = ITEM_RESPONSE_SCHEMA.parse(result.response_body);
        const suppliersNames: string[] = parsedResponse.data.supplier_items.map(record => record.supplier);
        expect(
            suppliersNames,
            `Supplier "${supplier.supplier_name}" should be in the array of suppliers`
        ).toContain(supplier.supplier_name);
        return item;
    }
}