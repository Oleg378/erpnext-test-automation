import {Customer, ErpDocument, Item, Supplier} from '../../../tools/utils/record-types';
import {DataUtils} from '../../../tools/utils/DataUtils';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {HomePage} from '../../pages/navigation/HomePage';
import {Navigation} from '../../components/Navigation';
import {TestDataFactory} from '../../../tools/utils/TestDataFactory';
import {ItemGroupEnum} from '../../../tools/utils/enums/ItemGroupEnum';
import {UOMEnum} from '../../../tools/utils/enums/UOMEnum';
import {ApiClient} from '../../api/ApiClient';
import {ORDER_TYPES, QUOTATION_TO_TYPES, QuotationPage} from '../../pages/domains/sales/quotation/QuotationPage';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {NewQuotationPage} from '../../pages/domains/sales/quotation/NewQuotationPage';
import {Step} from '../../../decorators/step.decorator';
import {QuotationAction} from './QuotationAction';
import {SalesFlow} from './SalesFlow';
import {LogInUtils} from '../../../tools/utils/LogInUtils';

export interface SalesFlowConfig {
    items?: Map<Item, number>;
    supplier?: Supplier;
    customer?: Customer;
}

export interface SalesFlowContext {
    items: Map<Item, number>;
    supplier: Supplier;
    customer: Customer;
    quotation?: ErpDocument;
    salesOrder?: ErpDocument;
    salesInvoice?: ErpDocument;
    materialRequest?: ErpDocument;
    purchaseOrder?: ErpDocument;
    purchaseReceipt?: ErpDocument;
    deliveryNote?: ErpDocument;
    paymentEntry?: ErpDocument;
}

export class SalesFlowInitializer extends SalesFlow {
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
        items: SalesFlowInitializer.DEFAULT_ITEMS,
        supplier: SalesFlowInitializer.DEFAULT_SUPPLIER,
        customer: SalesFlowInitializer.DEFAULT_CUSTOMER,
    }

    private constructor(config: SalesFlowConfig, apiManager: ApiManager, pageManager: PageManager) {
        const context = {
            items: config.items || SalesFlowInitializer.DEFAULT_ITEMS,
            supplier: config.supplier || SalesFlowInitializer.DEFAULT_SUPPLIER,
            customer: config.customer || SalesFlowInitializer.DEFAULT_CUSTOMER,
        };
        super(context, [], apiManager, pageManager);
    }

    @Step('Initiate test data')
    private async init() {
        await ApiClient.postRetrieveAdminCookies(this.apiManager, false)
        await DataUtils.ensureItemsWithPricingAndSupplier(this.apiManager, Array.from(this.context.items.keys()), this.context.supplier, false);
        await DataUtils.ensureCustomerExists(this.apiManager, this.context.customer, false);
    }

    /**
     * This method is the entry point to the sales flow
     * @tag User Action
     * @role Sales
     * @returns new QuotationStep
     *
     */
    static creteFlowWithQuotation(
        apiManager: ApiManager,
        pageManager: PageManager,
        config?: SalesFlowConfig
    ): QuotationAction {
        const salesFlow = new SalesFlowInitializer(
            config || SalesFlowInitializer.DEFAULT_CONFIG,
            apiManager,
            pageManager
        );
        salesFlow.addAction(() => salesFlow.init());
        salesFlow.addAction(() => salesFlow.createQuotationDraft());

        return new QuotationAction(salesFlow.context, salesFlow.pendingActions, apiManager, pageManager);
    }

    @Step('Sales User: Create Quotation Draft')
    private async createQuotationDraft(): Promise<void> {
        if (this.context.quotation) {
            throw new Error('Quotation already exists!');
        }
        const homePage: HomePage = (await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
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
    }
}