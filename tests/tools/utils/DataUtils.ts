import {Customer, Item, Supplier, User} from './record-types';
import {ApiClient} from '../../app/api/ApiClient';
import {ApiManager} from '../manager/ApiManager';
import {TestDataFactory} from './TestDataFactory';

export class DataUtils {
    constructor(
        private readonly apiManager: ApiManager,
        ) {}

    async ensureItemsWithPricingAndSupplier(items: Item[], supplier: Supplier, enableSteps: boolean = true): Promise<Item[]> {
        await this.ensureSupplierExists(supplier, enableSteps);

        for (const index of items) {
            await this.ensureItemExists(index, enableSteps)
            await ApiClient.putUpdateItemSupplier(index, supplier, this.apiManager, enableSteps);
            await this.ensureItemSellingPriceExists(index, enableSteps);
            await this.ensureItemBuyingPriceExists(index, enableSteps);
        }
        return items;
    }

    async ensureSupplierExists(supplier: Supplier, enableSteps: boolean = true): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(this.apiManager, enableSteps);
        if (!await ApiClient.isSupplierExists(this.apiManager, supplier, enableSteps)) {
            await ApiClient.postCreateNewSupplier(supplier, this.apiManager, enableSteps);
        }
    }

    async isStandardBuyingItemPriceExists(item: Item, enableSteps: boolean = true): Promise<boolean> {
        return await ApiClient.isItemPriceExists(
            this.apiManager,
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.buying,
            enableSteps
        );
    }

    async isStandardSellingItemPriceExists(item: Item, enableSteps: boolean = true): Promise<boolean> {
        return await ApiClient.isItemPriceExists(
            this.apiManager,
            item,
            TestDataFactory.DEFAULT_PRICE_LISTS.selling,
            enableSteps
        );
    }

    async ensureItemBuyingPriceExists(item: Item, enableSteps: boolean = true): Promise<void> {
        if (!await this.isStandardBuyingItemPriceExists(item, enableSteps)) {
            await ApiClient.postPriceForItem(
                this.apiManager,
                item, TestDataFactory.DEFAULT_PRICE_LISTS.buying,
                TestDataFactory.DEFAULT_PRICE.buying,
                enableSteps
            );
        }
    }

    async ensureItemSellingPriceExists(item: Item, enableSteps: boolean = true): Promise<void> {
        if (!await this.isStandardSellingItemPriceExists(item, enableSteps)) {
            await ApiClient.postPriceForItem(
                this.apiManager,
                item, TestDataFactory.DEFAULT_PRICE_LISTS.selling,
                TestDataFactory.DEFAULT_PRICE.selling,
                enableSteps
            );
        }
    }

    async ensureCustomerExists(customer: Customer, enableSteps: boolean = true): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(this.apiManager, enableSteps);
        if (!await ApiClient.isCustomerExists(this.apiManager, customer, enableSteps)) {
            await ApiClient.postCreateNewCustomer(customer, this.apiManager, enableSteps);
        }
    }

    async ensureUserExists(user: User): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(this.apiManager);
        if (!await ApiClient.isUserExists(this.apiManager, user)) {
            await ApiClient.postCreateNewUser(user, this.apiManager);
        }
    }
    async ensureItemExists(item: Item, enableSteps: boolean = true): Promise<void> {
        await ApiClient.postRetrieveAdminCookies(this.apiManager, enableSteps);
        if (!await ApiClient.isItemExists(this.apiManager, item, enableSteps)) {
            await ApiClient.postCreateNewItem(item, this.apiManager, enableSteps);
        }
    }
}