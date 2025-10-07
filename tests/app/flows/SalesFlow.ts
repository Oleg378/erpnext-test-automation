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

interface SalesFlowConfig {
    apiManager: ApiManager;
    items?: Item[];
    supplier?: Supplier;
    customer?: Customer;
}

export class SalesFlow {
    private readonly dataUtils: DataUtils;
    private readonly items: Item[];
    private readonly supplier: Supplier;
    private readonly customer: Customer;
    private readonly apiManager: ApiManager;

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

    constructor(
        config: SalesFlowConfig
    ) {
        this.apiManager = config.apiManager;
        this.dataUtils = new DataUtils(config.apiManager);
        this.items = config.items || SalesFlow.DEFAULT_ITEMS;
        this.supplier = config.supplier || SalesFlow.DEFAULT_SUPPLIER;
        this.customer = config.customer || SalesFlow.DEFAULT_CUSTOMER;

    }

    async init() {
        await this.dataUtils.ensureItemsWithPricingAndSupplier(this.items, this.supplier, false);
        await this.dataUtils.ensureCustomerExists(this.customer, false);
    }

    static async create(config: SalesFlowConfig): Promise<SalesFlow> {
        const instance = new SalesFlow(config);
        await instance.init();
        return instance;
    }

    sales = {
        createQuotation: async (
            pageManager: PageManager,
        ): Promise<string> => {
            const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
                this.apiManager,
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