import {Customer, Item, Supplier, Document} from '../../tools/utils/record-types';
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
import {SellingPage} from '../pages/navigation/SellingPage';
import {ORDER_TYPES, QUOTATION_TO_TYPES, QuotationPage} from '../pages/sales/quotation/QuotationPage';
import {QuotationListPage} from '../pages/sales/QuotationListPage';
import {NewQuotationPage} from '../pages/sales/quotation/NewQuotationPage';
import {DocStatesEnum} from '../../tools/utils/enums/DocStatesEnum';
import {DocTypesEnum} from '../../tools/utils/enums/DocTypesEnum';

interface SalesFlowConfig {
    items?: Map<Item, number>;
    supplier?: Supplier;
    customer?: Customer;
}

interface SalesFlowContext {
    items: Map<Item, number>;
    supplier: Supplier;
    customer: Customer;
    quotation?: Document;
}

export class SalesFlow {
    private context: SalesFlowContext;

    private static readonly SALES_USERNAME: string = 'Sales_User';
    private static readonly DEFAULT_ITEMS: Map<Item, number> = new Map<Item, number>([
        [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.UNIT, 'THE-RING'), 2],
        [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.KG, 'AXE'), 4],
        [TestDataFactory.generateItemInfo(ItemGroupEnum.PRODUCTS, UOMEnum.BOX, 'ARROW-FOR-BOROMIR'), 6]
        ]);
    private static readonly DEFAULT_SUPPLIER: Supplier = {supplier_name: 'SARUMAN'};
    private static readonly DEFAULT_CUSTOMER: Customer = {
        customer_name: 'BALROG',
        customer_type: 'Company'
    };
    private static readonly DEFAULT_CONFIG: SalesFlowConfig = {
        items: SalesFlow.DEFAULT_ITEMS,
        supplier: SalesFlow.DEFAULT_SUPPLIER,
        customer: SalesFlow.DEFAULT_CUSTOMER,
    }

    constructor(
        config: SalesFlowConfig
    ) {
        this.context = {
            items: config.items || SalesFlow.DEFAULT_ITEMS,
            supplier: config.supplier || SalesFlow.DEFAULT_SUPPLIER,
            customer: config.customer || SalesFlow.DEFAULT_CUSTOMER,
        }
    }

    async init(apiManager: ApiManager) {
        await ApiClient.postRetrieveAdminCookies(apiManager, false)
        await DataUtils.ensureItemsWithPricingAndSupplier(apiManager, Array.from(this.context.items.keys()), this.context.supplier, false);
        await DataUtils.ensureCustomerExists(apiManager, this.context.customer, false);
    }

    static async create(apiManager: ApiManager, config?: SalesFlowConfig): Promise<SalesFlow> {
        const instance = new SalesFlow(config || SalesFlow.DEFAULT_CONFIG);
        await instance.init(apiManager);
        return instance;
    }

    sales = {
        createQuotationDraft: async (
            apiManager: ApiManager,
            pageManager: PageManager,
        ): Promise<void> => {
            const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
                apiManager,
                pageManager,
                ProfileRoles.Sales,
                SalesFlow.SALES_USERNAME
            )).homePage;
            const sellingPage: SellingPage = await homePage.navigateTo(Navigation.SELLING);
            const quotationListPage: QuotationListPage = await sellingPage.openQuotationListPage();
            const newQuotation: NewQuotationPage = await quotationListPage.openNewQuotationPage();
            await newQuotation.setQuotationTo(QUOTATION_TO_TYPES.customer, this.context.customer.customer_name);
            await newQuotation.setOrderType(ORDER_TYPES.maintenance);
            await newQuotation.setItems(this.context.items);
            const quotationPage: QuotationPage = await newQuotation.saveQuotation();
            await quotationPage.validateDataInGrid(this.context.items);
            // await quotationPage.updateItemQuantity(Array.from(this.items.keys())[1], 5);
            const quotationName = await quotationPage.getQuotationDocumentName()
            this.context.quotation = {
                name: quotationName,
                status:  DocStatesEnum.DRAFT,
                doctype: DocTypesEnum.QUOTATION
            }
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