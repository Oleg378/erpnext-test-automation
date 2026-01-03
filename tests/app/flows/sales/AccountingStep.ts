import {SalesFlow} from './SalesFlow';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {DeliveryStep} from './DeliveryStep';

export class AccountingStep extends SalesFlow {
    constructor(flow: DeliveryStep) {
        super(flow.getContext());
        this.pendingActions = [...flow.getPendingActions()];
    }

    /**
     * @tag User Action
     * @role Accounting
     * @returns {<this>} The current SalesFlow instance
     */
    createSalesInvoice(
        apiManager: ApiManager,
        pageManager: PageManager
    ): this {
        this.addAction(() => this.executeCreateSalesInvoice(apiManager, pageManager));
        return this;
    }

    /**
     * Must be called after .createSalesInvoice()
     * @tag User Action
     * @role Accounting
     */
    createPaymentEntry(
        apiManager: ApiManager,
        pageManager: PageManager
    ): this {
        this.addAction(() => this.executeCreatePaymentEntry(apiManager, pageManager));
        return this;
    }

    @Step("Accounts User: Create Sales Invoice")
    private async executeCreateSalesInvoice(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
        if (this.context.salesOrder?.status !== DocStatesEnum.TO_DELIVER_AND_BILL) {
            throw new Error('Cannot create sales invoice: Sales Order is undefined');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            ProfileRoles.Accounts,
            SalesFlow.ACCOUNTING_USERNAME
        )
        const salesInvoices = await loggedInUser.homePage.openSalesInvoicesPage();
        const newSalesInvoice = await salesInvoices.openNewSalesInvoicePage();
        await newSalesInvoice.getItemsFromSalesOrder(this.context.salesOrder);
        const salesInvoice = await newSalesInvoice.saveDocument();
        const documentName = await salesInvoice.getDocumentName();

        this.context.salesInvoice = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.SALES_INVOICE
        }
        await salesInvoice.submitDocument(this.context.salesInvoice);
    }

    async executeCreatePaymentEntry(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
    }
}