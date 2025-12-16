import {Customer, Item, Supplier, ErpDocument} from '../../tools/utils/record-types';
import {DataUtils} from '../../tools/utils/DataUtils';
import {ApiManager} from '../../tools/manager/ApiManager';
import {PageManager} from '../../tools/manager/PageManager';
import {LoggedInUser, LogInUtils} from '../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../tools/ProfileRoles';
import {HomePage} from '../pages/navigation/HomePage';
import {Navigation} from '../components/Navigation';
import {TestDataFactory} from '../../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../../tools/utils/enums/UOMEnum';
import {ApiClient} from '../api/ApiClient';
import {ORDER_TYPES, QUOTATION_TO_TYPES, QuotationPage} from '../pages/sales/quotation/QuotationPage';
import {QuotationListPage} from '../pages/sales/quotation/QuotationListPage';
import {DocStatesEnum} from '../../tools/utils/enums/DocStatesEnum';
import {DocTypesEnum} from '../../tools/utils/enums/DocTypesEnum';
import {NewSalesOrderPage} from '../pages/sales/sales-order/NewSalesOrderPage';
import {SalesOrderPage} from '../pages/sales/sales-order/SalesOrderPage';
import {NewQuotationPage} from '../pages/sales/quotation/NewQuotationPage';
import {Step} from '../../decorators/step.decorator';

export interface SalesFlowConfig {
    items?: Map<Item, number>;
    supplier?: Supplier;
    customer?: Customer;
}

interface SalesFlowContext {
    items: Map<Item, number>;
    supplier: Supplier;
    customer: Customer;
    quotation?: ErpDocument;
    salesOrder?: ErpDocument;
}

type SalesFlowState =
    | 'INITIAL'
    | 'QUOTATION_DRAFT_CREATED'
    | 'QUOTATION_SUBMITTED'
    | 'ORDER_DRAFT_CREATED'
    | 'COMPLETED';

export class SalesFlow {
    private context: SalesFlowContext;
    private state: SalesFlowState = 'INITIAL';

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

    private constructor(
        config: SalesFlowConfig
    ) {
        this.context = {
            items: config.items || SalesFlow.DEFAULT_ITEMS,
            supplier: config.supplier || SalesFlow.DEFAULT_SUPPLIER,
            customer: config.customer || SalesFlow.DEFAULT_CUSTOMER,
        }
    }

    private async init(apiManager: ApiManager) {
        await ApiClient.postRetrieveAdminCookies(apiManager, false)
        await DataUtils.ensureItemsWithPricingAndSupplier(apiManager, Array.from(this.context.items.keys()), this.context.supplier, false);
        await DataUtils.ensureCustomerExists(apiManager, this.context.customer, false);
    }

    static async create(apiManager: ApiManager, config?: SalesFlowConfig): Promise<SalesFlow> {
        const salesFlow = new SalesFlow(config || SalesFlow.DEFAULT_CONFIG);
        await salesFlow.init(apiManager);
        return salesFlow;
    }

    /**
     * Call this method inside each SalesFlow Action
     * before anything else to secure the state transitioning.
     * @private
     */
    private validateState(expectedState: SalesFlowState): void {
        if (this.state !== expectedState) {
            throw new Error(`salesFlow must be in state ${expectedState}, 
                    current state is ${this.state}`);
        }
    }

    /**
     * Sales User Action.
     * @prop this.state must be INITIAL
     */
    @Step('Create Quotation Draft as Sales User')
    async createQuotationDraft(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<this> {
        this.validateState('INITIAL')
        const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            ProfileRoles.Sales,
            SalesFlow.SALES_USERNAME
        )).homePage;
        const newQuotationPage: NewQuotationPage = await homePage.navigateTo(Navigation.SELLING)
            .then(sellingPage =>
                sellingPage.openQuotationListPage())
            .then(quotationList =>
                quotationList.openNewQuotationPage())
            .then(newQuotation =>
                newQuotation.setQuotationTo(QUOTATION_TO_TYPES.customer, this.context.customer.customer_name));
        await newQuotationPage.setOrderType(ORDER_TYPES.maintenance);
        await newQuotationPage.setItems(this.context.items);

        const quotationPage: QuotationPage = await newQuotationPage.saveDocument()
        await quotationPage.validateItemsInGrid(this.context.items)
        const documentName: string = await quotationPage.getDocumentName();

        this.context.quotation = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.QUOTATION
        }
        this.state = 'QUOTATION_DRAFT_CREATED';
        return this;
    }

    /**
     * Sales User Action.
     * @prop this.state must be QUOTATION_DRAFT_CREATED
     */
    @Step(`Submit Quotation as Sales User`)
    async submitQuotation(
        apiManager: ApiManager,
        pageManager: PageManager
    ) : Promise<this> {
        this.validateState('QUOTATION_DRAFT_CREATED');
        if (!this.context.quotation) {
            throw new Error('Cannot create sales order: quotation is undefined');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            ProfileRoles.Sales,
            SalesFlow.SALES_USERNAME
        );
        const quotationListPage: QuotationListPage = await loggedInUser
            .homePage
            .navigateTo(Navigation.SELLING)
            .then(sellingPage =>
                sellingPage.openQuotationListPage());
        const quotationPage: QuotationPage = await quotationListPage.openQuotationByDocumentName(this.context.quotation.name);
        await quotationPage.submitDocument(this.context.quotation);
        this.state = 'QUOTATION_SUBMITTED';
        return this;
    }

    /**
     * Sales User Action.
     * @prop this.state must be QUOTATION_SUBMITTED
     */
    @Step(`Create Order Draft as Sales User`)
    async createOrderDraft(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<this> {
        this.validateState('QUOTATION_SUBMITTED');
        if (!this.context.quotation) {
            throw new Error('Cannot create sales order: quotation is undefined');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            ProfileRoles.Sales,
            SalesFlow.SALES_USERNAME
        )
        const newSalesOrderPage: NewSalesOrderPage = await loggedInUser
            .homePage
            .navigateTo(Navigation.SELLING)
            .then(sellingPage =>
                sellingPage.openSalesOrderListPage())
            .then(salesOrderListPage =>
                salesOrderListPage.openNewSalesOrderPage());

        await newSalesOrderPage.getItemsFromQuotation(this.context.quotation, this.context.customer);
        await newSalesOrderPage.setDeliveryDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
        const salesOrderPage: SalesOrderPage = await newSalesOrderPage.saveDocument();

        const documentName = await salesOrderPage.getDocumentName();
        this.context.salesOrder = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.SALES_ORDER
        };
        this.state = 'ORDER_DRAFT_CREATED';
        return this;

    }

    inventory = {
        prepareGoodsForDelivery: () => {}, // check stock -> purchase/manufacture items 3,4,5)
        shipGoodsToCustomer: () => {} // might be sales as well 6)
    }

    accounts = {
        processBilling: () => {}
    }

}