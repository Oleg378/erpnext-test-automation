import {Customer, Item, Supplier, User} from './record-types';
import {ApiClient} from '../../app/api/ApiClient';
import {ApiManager} from '../manager/ApiManager';
import {TestDataFactory} from './TestDataFactory';

export abstract class DataUtils {

    static async ensureItemsWithPricingAndSupplier(
        apiManager: ApiManager,
        items: Item[],
        supplier: Supplier,
        enableSteps: boolean = true
    ): Promise<Item[]> {
        await DataUtils.ensureSupplierExists(apiManager, supplier, enableSteps);
        for (const index of items) {
            await DataUtils.ensureItemExists(apiManager, index, enableSteps)
            await ApiClient.putUpdateItemSupplier(index, supplier, apiManager, enableSteps);
            await DataUtils.ensureItemSellingPriceExists(apiManager, index, enableSteps);
            await DataUtils.ensureItemBuyingPriceExists(apiManager, index, enableSteps);
        }
        return items;
    }

    static async ensureSupplierExists(
        apiManager: ApiManager,
        supplier: Supplier,
        enableSteps: boolean = true
    ): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await ApiClient.isSupplierExists(apiManager, supplier, enableSteps)) {
            await ApiClient.postCreateNewSupplier(supplier, apiManager, enableSteps);
        }
    }

    static async isStandardBuyingItemPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await ApiClient.isItemPriceExists(
            apiManager,
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.buying,
            enableSteps
        );
    }

    static async isStandardSellingItemPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await ApiClient.isItemPriceExists(
            apiManager,
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.selling,
            enableSteps
        );
    }

    static async ensureItemBuyingPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        if (!await DataUtils.isStandardBuyingItemPriceExists(apiManager, item, enableSteps)) {
            await ApiClient.postPriceForItem(
                apiManager,
                item, TestDataFactory.DEFAULT_PRICE_LISTS.buying,
                TestDataFactory.DEFAULT_PRICE.buying,
                enableSteps
            );
        }
    }

    static async ensureItemSellingPriceExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        if (!await DataUtils.isStandardSellingItemPriceExists(apiManager, item, enableSteps)) {
            await ApiClient.postPriceForItem(
                apiManager,
                item, TestDataFactory.DEFAULT_PRICE_LISTS.selling,
                TestDataFactory.DEFAULT_PRICE.selling,
                enableSteps
            );
        }
    }

    static async ensureCustomerExists(
        apiManager: ApiManager,
        customer: Customer,
        enableSteps: boolean = true
    ): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await ApiClient.isCustomerExists(apiManager, customer, enableSteps)) {
            await ApiClient.postCreateNewCustomer(customer, apiManager, enableSteps);
        }
    }

    static async ensureUserExists(
        apiManager: ApiManager,
        user: User,
        enableSteps: boolean = true
    ): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await ApiClient.isUserExists(apiManager, user, enableSteps)) {
            await ApiClient.postCreateNewUser(user, apiManager, enableSteps);
        }
    }
    static async ensureItemExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(apiManager, enableSteps);
        if (!await ApiClient.isItemExists(apiManager, item, enableSteps)) {
            await ApiClient.postCreateNewItem(item, apiManager, enableSteps);
        }
    }
}