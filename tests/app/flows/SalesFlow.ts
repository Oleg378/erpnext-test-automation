import {Customer, Item, Supplier} from '../../tools/utils/record-types';
import {DataUtils} from '../../tools/utils/DataUtils';
import {ApiManager} from '../../tools/manager/ApiManager';
import {PageManager} from '../../tools/manager/PageManager';
import {LogInUtils} from '../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../tools/ProfileRoles';
import {HomePage} from '../pages/navigation/HomePage';
import {Navigation} from '../components/Navigation';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../../tools/utils/enums/UOMEnum';
import {ApiClient} from '../api/ApiClient';

interface SalesFlowConfig {
    items?: Item[];
    supplier?: Supplier;
    customer?: Customer;
}

export class SalesFlow {
    private readonly items: Item[];
    private readonly supplier: Supplier;
    private readonly customer: Customer;

    private static readonly SALES_USERNAME: string = 'Sales_User';
    private static readonly DEFAULT_ITEMS: Item[] = [
        TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'THE-RING'),
        TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.KG, 'AXE'),
        TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.BOX, 'ARROW-FOR-BOROMIR')
    ];
    private static readonly DEFAULT_SUPPLIER: Supplier = {supplier_name: 'SARUMAN'};
    private static readonly DEFAULT_CUSTOMER: Customer = {
        customer_name: 'BALROG',
        customer_type: 'Company'
    };
    private static readonly DEFAULT_CONFIG: SalesFlowConfig = {
        items: SalesFlow.DEFAULT_ITEMS,
        supplier: SalesFlow.DEFAULT_SUPPLIER,
        customer: SalesFlow.DEFAULT_CUSTOMER
    }

    constructor(
        config: SalesFlowConfig
    ) {
        this.items = config.items || SalesFlow.DEFAULT_ITEMS;
        this.supplier = config.supplier || SalesFlow.DEFAULT_SUPPLIER;
        this.customer = config.customer || SalesFlow.DEFAULT_CUSTOMER;

    }

    async init(apiManager: ApiManager) {
        await ApiClient.postRetrieveAdminCookies(apiManager, false)
        await DataUtils.ensureItemsWithPricingAndSupplier(apiManager, this.items, this.supplier, false);
        await DataUtils.ensureCustomerExists(apiManager, this.customer, false);
    }

    static async create(apiManager: ApiManager, config?: SalesFlowConfig): Promise<SalesFlow> {
        const instance = new SalesFlow(config || SalesFlow.DEFAULT_CONFIG);
        await instance.init(apiManager);
        return instance;
    }

    sales = {
        createQuotation: async (
            apiManager: ApiManager,
            pageManager: PageManager,
        ): Promise<string> => {
            const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
                apiManager,
                pageManager,
                ProfileRoles.Sales,
                SalesFlow.SALES_USERNAME
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