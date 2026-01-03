import {QuotationStep} from './QuotationStep';
import {SalesFlow} from './SalesFlow';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {NewSalesOrderPage} from '../../pages/sales/sales-order/NewSalesOrderPage';
import {Navigation} from '../../components/Navigation';
import {SalesOrderPage} from '../../pages/sales/sales-order/SalesOrderPage';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {ProcurementStep} from './ProcurementStep';

export class SalesOrderStep extends SalesFlow {
    constructor(flow: QuotationStep) {
        super(flow.getContext());
        this.pendingActions = [...flow.getPendingActions()]
    }

    /**
     * @tag User Action
     * @role Sales
     * @returns new ProcurementStep
     */
    createAndSubmitSalesOrder(
        apiManager: ApiManager,
        pageManager: PageManager
    ): ProcurementStep {
        this.addAction(() => this.executeCreateOrderAndSubmit(apiManager, pageManager));
        return new ProcurementStep(this);
    }

    @Step(`Complete Sales Order Creation as Sales User`)
    private async executeCreateOrderAndSubmit(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
        if (this.context.quotation?.status != DocStatesEnum.OPEN) {
            throw new Error('Cannot create sales order: quotation is undefined or not submitted!');
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

        await newSalesOrderPage.getItemsFromQuotation(this.context.quotation);
        await newSalesOrderPage.setDeliveryDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
        const salesOrderPage: SalesOrderPage = await newSalesOrderPage.saveDocument();

        const documentName = await salesOrderPage.getDocumentName();
        this.context.salesOrder = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.SALES_ORDER
        };
        await salesOrderPage.submitDocument(this.context.salesOrder);
    }
}