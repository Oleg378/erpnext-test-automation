import {apiTest} from '../../fixtures/api.test.fixture';
import {TestDataFactory} from '../../app/data/TestDataFactory';
import {expect} from '@playwright/test';
import {ApiManager} from '../../managers/ApiManager';
import {Step} from '../../decorators/step.decorator';
import {AuthClient} from '../../app/api-clients/auth-client/AuthClient';
import {CustomerClient} from '../../app/api-clients/customer-client/CustomerClient';
import {Customer} from '../../app/types/customer.type';

const customer: Customer = {
    customer_name: `customer.spec_${TestDataFactory.generateUID()}`,
    customer_type: 'Company'
}

class CustomerSpec {
    @Step('Assert Customer Exists')
    static async assertCustomerExists(apiManager: ApiManager):Promise<void> {
        const isCustomer = await CustomerClient.isCustomerExists(customer, apiManager)
        expect(isCustomer).toBeTruthy();
    }
}

apiTest.describe('Create Customer @customer @api-clients', () => {
    apiTest('Create new Customer', async ({apiManager}) => {
        await AuthClient.postRetrieveAdminCookies(apiManager);
        await CustomerClient.postCreateNewCustomer(customer, apiManager);
        await CustomerSpec.assertCustomerExists(apiManager);
    })
})

