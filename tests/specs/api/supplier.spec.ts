import {apiTest} from '../../fixtures/api.test.fixture';
import {TestDataFactory} from '../../app/data/TestDataFactory';
import {expect} from '@playwright/test';
import {ApiManager} from '../../managers/ApiManager';
import {Step} from '../../decorators/step.decorator';
import {AuthClient} from '../../app/api-clients/auth-client/AuthClient';
import {SupplierClient} from '../../app/api-clients/supplier-client/SupplierClient';
import {Supplier} from '../../app/types/supplier.type';

const supplier: Supplier = {
    supplier_name: `supplier.spec_${TestDataFactory.generateUID()}`
}

class SupplierSpec {
    @Step('Assert Supplier Exists')
    static async assertSupplierExists(apiManager: ApiManager):Promise<void> {
        const isSupplier = await SupplierClient.isSupplierExists(apiManager, supplier)
        expect(isSupplier).toBeTruthy();
    }
}

apiTest.describe('Create Supplier @supplier @api-clients', () => {
    apiTest('Create new Supplier', async ({apiManager}) => {
        await AuthClient.postRetrieveAdminCookies(apiManager);
        await SupplierClient.postCreateNewSupplier(supplier, apiManager);
        await SupplierSpec.assertSupplierExists(apiManager);
    })
})

