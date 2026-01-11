import {apiTest} from '../../fixtures/api.test.fixture';
import {ApiClient} from '../../app/api/ApiClient';
import {Supplier} from '../../tools/utils/record-types';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {expect} from '@playwright/test';
import {ApiManager} from '../../tools/manager/ApiManager';
import {Step} from '../../decorators/step.decorator';

const supplier: Supplier = {
    supplier_name: `supplier.spec_${TestDataFactory.generateUID()}`
}

class SupplierSpec {
    @Step('Assert Supplier Exists')
    static async assertSupplierExists(apiManager: ApiManager):Promise<void> {
        const isSupplier = await ApiClient.isSupplierExists(apiManager, supplier)
        expect(isSupplier).toBeTruthy();
    }
}

apiTest.describe('Create Supplier @supplier @api', () => {
    apiTest('Create new Supplier', async ({apiManager}) => {
        await ApiClient.postRetrieveAdminCookies(apiManager);
        await ApiClient.postCreateNewSupplier(supplier, apiManager);
        await SupplierSpec.assertSupplierExists(apiManager);
    })
})

