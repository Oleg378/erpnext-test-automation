import {ApiManager} from '../../tools/manager/ApiManager';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {expect} from '@playwright/test';
import {
    Company,
    COMPANY_RESPONSE_SCHEMA,
    Customer,
    CUSTOMER_RESPONSE_SCHEMA,
    Item,
    ITEM_RESPONSE_SCHEMA,
    QUOTATION_SCHEMA,
    QuotationResponse,
    SALES_ORDER_SCHEMA,
    SalesOrderResponse,
    Supplier,
    SUPPLIER_RESPONSE_SCHEMA,
    User,
    USER_RESPONSE_SCHEMA
} from '../../tools/utils/record-types';
import {z} from 'zod';

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

        return customer;
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

    static async postPriceForItem(
        apiManager: ApiManager,
        item: Item,
        priceList: string,
        priceRate: number,
        enableSteps: boolean = true
    ): Promise<{
        item_code: string,
        price_list: string,
        price_list_rate: number,
        currency: string }> {
        const itemPrice = {
            item_code: item.item_code,
            price_list: priceList,
            price_list_rate: priceRate
        }
        const result = await apiManager.postCreateRecord(
            '/api/resource/Item Price',
            'Item Price',
            itemPrice,
            enableSteps
        );
        const responseSchema = z.object({
            data: z.object({
                name: z.string(),
                item_code: z.string(),
                price_list: z.string(),
                price_list_rate: z.number(),
                currency: z.string()
            })
        });
        const parsedResponse = responseSchema.parse(result.response_body);
        expect(
            parsedResponse.data.price_list,
            `"price_list" should equal ${result.request_body.price_list}`
        ).toBe(result.request_body.price_list);
        expect(
            parsedResponse.data.price_list_rate,
            `"price_list_rate" should equal ${result.request_body.price_list_rate}`
        ).toBe(result.request_body.price_list_rate)
        return {
            item_code: parsedResponse.data.item_code,
            price_list: parsedResponse.data.price_list,
            price_list_rate: parsedResponse.data.price_list_rate,
            currency: parsedResponse.data.currency
        }
    }

    static async getSalesOrder(
        documentName: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<SalesOrderResponse> {
        const result = await apiManager.getRecord(
            '/api/resource/Sales Order',
            documentName,
            enableSteps
        );
        return SALES_ORDER_SCHEMA.parse(result);
    }

    static async getQuotation(
        documentName: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<QuotationResponse> {
        const result = await apiManager.getRecord(
            '/api/resource/Quotation',
            documentName,
            enableSteps
        );
        return QUOTATION_SCHEMA.parse(result);
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

    static async isItemExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Item',
            item.item_code,
            enableSteps
        );
    }

    static async isUserExists(
        apiManager: ApiManager,
        user: User,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/User',
            user.email,
            enableSteps
        );
    }

    static async isSupplierExists(
        apiManager: ApiManager,
        supplier: Supplier,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Supplier',
            supplier.supplier_name,
            enableSteps
        );
    }

    static async isCustomerExists(
        apiManager: ApiManager,
        customer: Customer,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Customer',
            customer.customer_name,
            enableSteps
        );
    }

    static async isCompanyExists(
        apiManager: ApiManager,
        companyName: string,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Company',
            companyName,
            enableSteps
        );
    }

    static async isItemPriceExists(
        apiManager: ApiManager,
        item: Item,
        priceList: string,
        enableSteps: boolean = true
    ): Promise<boolean> {
        const responseSchema = z.object({
            message: z.array(
                z.object({
                    name: z.string(), // item price document name
                    item_code: z.string(),
                    price_list: z.string(),
                    price_list_rate: z.number(),
                })
            )
        });

        const response = await apiManager.getListOf(
            'Item Price',
            ["name", "item_code", "price_list", "price_list_rate"],
            [["item_code", "=", item.item_code]],
            enableSteps
        );
        const parsedData = responseSchema.parse(response);
        const itemsFromResponse: string[] = parsedData.message.map(item => item.item_code)
        for (const index of itemsFromResponse) {
            expect(
                index,
                `Item code from response should be ${item.item_code}`
            ).toBe(item.item_code);
        }
        return parsedData.message.filter(
            item => item.price_list === priceList
        ).length > 0;
    }

    static async putUpdateItemSupplier(
        item: Item,
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Item> {
        const record = {
            supplier_items: [
                {
                    supplier: supplier.supplier_name
                }
            ]
        }
        const result = await apiManager
            .putUpdateRecord(
                `/api/resource/Item/${item.item_code}`,
                item.item_code,
                record,
                enableSteps
            );
        const parsedResponse = ITEM_RESPONSE_SCHEMA.parse(result.response_body);
        const suppliersNames: string[] = parsedResponse.data.supplier_items.map(record => record.supplier);
        expect(
            suppliersNames,
            `Supplier "${supplier.supplier_name}" should be in the array of suppliers`
        ).toContain(supplier.supplier_name);
        return item;
    }
}