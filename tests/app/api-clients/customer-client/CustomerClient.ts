import {ApiManager} from '../../../managers/ApiManager';
import {expect} from '@playwright/test';
import {Customer} from '../../types/customer.type';
import {CUSTOMER_RESPONSE_SCHEMA, CustomerResponse} from './customer.schemas';
import {Step} from '../../../decorators/step.decorator';

export abstract class CustomerClient {
    @Step('Create new Customer')
    static async postCreateNewCustomer(
        customer: Customer,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<CustomerResponse> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Customer',
            'Customer',
            customer,
            enableSteps
        );
        const parsedResponse: CustomerResponse = CUSTOMER_RESPONSE_SCHEMA.parse(result.response_body);

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

        return parsedResponse;
    }

    static async isCustomerExists(
        customer: Customer,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Customer',
            customer.customer_name,
            enableSteps
        );
    }
}