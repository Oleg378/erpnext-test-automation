import {Customer, Item, Supplier} from '../../tools/utils/record-types';
import {DataUtils} from '../../tools/utils/DataUtils';
import {ApiManager} from '../../tools/manager/ApiManager';
import {PageManager} from '../../tools/manager/PageManager';
import {LogInUtils} from '../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../tools/ProfileRoles';
import {HomePage} from '../pages/navigation/HomePage';
import {Navigation} from '../components/Navigation';

export class SalesFlow {
    private readonly DATA_UTILS: DataUtils;
    private readonly SALES_USERNAME: string = 'Sales_User';

    constructor(
        private readonly items: Item[],
        private readonly supplier: Supplier,
        private readonly customer: Customer,
        private readonly apiManager: ApiManager
    ) {
        this.DATA_UTILS = new DataUtils(apiManager);
    }

    async init() {
        await this.DATA_UTILS.ensureItemsWithPricingAndSupplier(this.items, this.supplier, false);
        await this.DATA_UTILS.ensureCustomerExists(this.customer, false);
    }

    sales = {
        createQuotation: async (
            pageManager: PageManager,
        ): Promise<string> => {
            const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
                this.apiManager,
                pageManager,
                ProfileRoles.Sales,
                this.SALES_USERNAME
            )).homePage;
            await homePage.navigateTo(Navigation.SELLING)
            // POM magic
             return 'quotation document UID';

        },
        completeOrder: async (
            quotationRequest: string,
            pageManager: PageManager
        ): Promise<string> => {
            // POM magic
            return 'order document UID';
        }
    }

    inventory = {
        prepareGoodsForDelivery: () => {}, // check stock -> purchase/manufacture items 3,4,5)
        shipGoodsToCustomer: () => {} // might be sales as well 6)

    }

    accounts = {
        processBilling: () => {}
    }

}