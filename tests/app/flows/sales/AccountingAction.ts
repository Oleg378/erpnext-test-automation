import {SalesFlow} from './SalesFlow';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {SalesFlowContext} from './SalesFlowInitializer';

export class AccountingAction extends SalesFlow {
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
     * @role Accounting
     * @returns current AccountingStep instance
     */
    createAndSubmitSalesInvoice(): this {
        this.addAction(() => this.executeCreateAndSubmitSalesInvoice());
        return this;
    }

    /**
     * Must be called after .createAndSubmitSalesInvoice()
     * @tag User Action
     * @role Accounting
     * @returns current AccountingStep instance
     */
    createAndSubmitPaymentEntry(): this {
        this.addAction(() => this.executeCreateAndSubmitPaymentEntry());
        return this;
    }

    @Step('Accounting User: Create and Submit Sales Invoice')
    private async executeCreateAndSubmitSalesInvoice(): Promise<void> {
        if (this.context.salesOrder?.status !== DocStatesEnum.TO_DELIVER_AND_BILL) {
            throw new Error('Cannot create Sales Invoice: Sales Order is undefined or not submitted');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Accounts,
            SalesFlow.ACCOUNTING_USERNAME
        )
        const salesInvoices = await loggedInUser.homePage.openSalesInvoiceListPage();
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

    @Step('Accounting User: Create and Submit Payment Entry')
    async executeCreateAndSubmitPaymentEntry(): Promise<void> {
        if (this.context.salesInvoice?.status !== DocStatesEnum.UNPAID) {
            throw new Error('Cannot create Payment Entry: Sales Order is undefined or not submitted');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Accounts,
            SalesFlow.ACCOUNTING_USERNAME
        )
        const salesInvoiceList = await loggedInUser.homePage.openSalesInvoiceListPage();
        const salesInvoice = await salesInvoiceList.openSalesInvoiceByDocumentName(this.context.salesInvoice.name);
        const newPaymentEntry = await salesInvoice.createPaymentEntryViaContextMenu();
        const paymentEntry = await newPaymentEntry.setReferenceNumber(Date.now().toString()).then(
            newPaymentEntry => newPaymentEntry.saveDocument()
        );
        const documentName = await paymentEntry.getDocumentName();
        this.context.paymentEntry = {
            name: documentName,
            status: DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.PAYMENT_ENTRY
        }
        await paymentEntry.submitDocument(this.context.paymentEntry);
    }
}