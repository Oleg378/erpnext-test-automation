import {SalesFlow} from './SalesFlow';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {NewSalesOrderPage} from '../../pages/domains/sales/sales-order/NewSalesOrderPage';
import {Navigation} from '../../components/Navigation';
import {SalesOrderPage} from '../../pages/domains/sales/sales-order/SalesOrderPage';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {ProcurementAction} from './ProcurementAction';
import {SalesFlowContext} from './SalesFlowInitializer';

export class SalesOrderAction extends SalesFlow {
    constructor(
        context: SalesFlowContext,
        pendingActions: Array<() => Promise<void>>,
        apiManager: ApiManager,
        pageManager: PageManager
    ) {
        super(context, pendingActions, apiManager, pageManager);
    }

    /**
     * @tag User Action
     * @role Sales
     * @returns new ProcurementStep
     */
    createAndSubmitSalesOrder(): ProcurementAction {
        this.addAction(() => this.executeCreateOrderAndSubmit());
        return new ProcurementAction(this.context, this.pendingActions, this.apiManager, this.pageManager);
    }

    @Step('Sales User: Complete Sales Order Creation')
    private async executeCreateOrderAndSubmit(
    ): Promise<void> {
        if (this.context.quotation?.status != DocStatesEnum.OPEN) {
            throw new Error('Cannot create sales order: quotation is undefined or not submitted!');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Sales,
            SalesFlow.SALES_USERNAME
        );
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