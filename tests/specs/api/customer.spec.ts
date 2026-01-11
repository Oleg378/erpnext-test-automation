import {apiTest} from '../../fixtures/api.test.fixture';
import {ApiClient} from '../../app/api/ApiClient';
import {Customer} from '../../tools/utils/record-types';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {expect} from '@playwright/test';
import {ApiManager} from '../../tools/manager/ApiManager';
import {Step} from '../../decorators/step.decorator';

const customer: Customer = {
    customer_name: `customer.spec_${TestDataFactory.generateUID()}`,
    customer_type: 'Company'
}

class CustomerSpec {
    @Step('Assert Customer Exists')
    static async assertCustomerExists(apiManager: ApiManager):Promise<void> {
        const isCustomer = await ApiClient.isCustomerExists(apiManager, customer)
        expect(isCustomer).toBeTruthy();
    }
}

apiTest.describe('Create Customer @customer @api', () => {
    apiTest('Create new Customer', async ({apiManager}) => {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        await ApiClient.postCreateNewCustomer(customer, apiManager);
        await CustomerSpec.assertCustomerExists(apiManager);
    })
})

