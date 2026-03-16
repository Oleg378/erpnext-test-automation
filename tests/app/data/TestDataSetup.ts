import {ApiManager} from '../../managers/ApiManager';
import {TestDataFactory} from './TestDataFactory';
import {Step} from '../../decorators/step.decorator';
import {AuthClient} from '../api-clients/auth-client/AuthClient';
import {UserClient} from '../api-clients/user-client/UserClient';
import {ItemClient} from '../api-clients/item-client/ItemClient';
import {CustomerClient} from '../api-clients/customer-client/CustomerClient';
import {SupplierClient} from '../api-clients/supplier-client/SupplierClient';
import {Customer} from '../types/customer.type';
import {User} from '../types/user.type';
import {Item} from '../types/item.type';
import {Supplier} from '../types/supplier.type';

export abstract class TestDataSetup {

    @Step('ensure Items have Pricing And Supplier')
    static async ensureItemsWithPricingAndSupplier(
        apiManager: ApiManager,
        items: Item[],
        supplier: Supplier,
        enableSteps: boolean = true
    ): Promise<Item[]> {
        await TestDataSetup.ensureSupplierExists(apiManager, supplier, enableSteps);
        for (const index of items) {
            await TestDataSetup.ensureItemExists(apiManager, index, enableSteps)
            await ItemClient.putUpdateItemSupplier(index, supplier, apiManager, enableSteps);
            await TestDataSetup.ensureItemSellingPriceExists(apiManager, index, enableSteps);
            await TestDataSetup.ensureItemBuyingPriceExists(apiManager, index, enableSteps);
        }
        return items;
    }
    @Step('Ensure Supplier Exists')
    static async ensureSupplierExists(
        apiManager: ApiManager,
        supplier: Supplier,
        enableSteps: boolean = true
    ): Promise<void> {
        await AuthClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await SupplierClient.isSupplierExists(supplier, apiManager, enableSteps)) {
            await SupplierClient.postCreateNewSupplier(supplier, apiManager, enableSteps);
        }
    }

    static async isStandardBuyingItemPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await ItemClient.isItemPriceExists(
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.buying,
            apiManager,
            enableSteps
        );
    }

    static async isStandardSellingItemPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await ItemClient.isItemPriceExists(
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.selling,
            apiManager,
            enableSteps
        );
    }

    @Step('Ensure Item Buying Price Exists')
    static async ensureItemBuyingPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        if (!await TestDataSetup.isStandardBuyingItemPriceExists(apiManager, item, enableSteps)) {
            await ItemClient.postPriceForItem(
                item, TestDataFactory.DEFAULT_PRICE_LISTS.buying,
                TestDataFactory.DEFAULT_PRICE.buying,
                apiManager,
                enableSteps
            );
        }
    }

    @Step('Ensure Item Selling Price Exists')
    static async ensureItemSellingPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        if (!await TestDataSetup.isStandardSellingItemPriceExists(apiManager, item, enableSteps)) {
            await ItemClient.postPriceForItem(
                item, TestDataFactory.DEFAULT_PRICE_LISTS.selling,
                TestDataFactory.DEFAULT_PRICE.selling,
                apiManager,
                enableSteps
            );
        }
    }

    @Step('Ensure Customer Exists')
    static async ensureCustomerExists(
        apiManager: ApiManager,
        customer: Customer,
        enableSteps: boolean = true
    ): Promise<void> {
        await AuthClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await CustomerClient.isCustomerExists(customer, apiManager, enableSteps)) {
            await CustomerClient.postCreateNewCustomer(customer, apiManager, enableSteps);
        }
    }

    @Step('Ensure User Exists')
    static async ensureUserExists(
        apiManager: ApiManager,
        user: User,
        enableSteps: boolean = true
    ): Promise<void> {
        await AuthClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await UserClient.isUserExists(user, apiManager, enableSteps)) {
            await UserClient.postCreateNewUser(user, apiManager, enableSteps);
        }
    }

    @Step('Ensure Item Exists')
    static async ensureItemExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        await AuthClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await ItemClient.isItemExists(apiManager, item, enableSteps)) {
            await ItemClient.postCreateNewItem(item, apiManager, enableSteps);
        }
    }
}