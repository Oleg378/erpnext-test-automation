import {SalesFlow} from './SalesFlow';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {AccountingAction} from './AccountingAction';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {Navigation} from '../../components/Navigation';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {Step} from '../../../decorators/step.decorator';
import {SalesFlowContext} from './SalesFlowInitializer';

export class DeliveryAction extends SalesFlow {
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
     * @role Inventory
     * @returns new AccountingStep
     */
    createAndSubmitDeliveryNote(): AccountingAction {
        this.addAction(() => this.executeCreateAndSubmitDeliveryNote());
        return new AccountingAction(this.context, this.pendingActions, this.apiManager, this.pageManager);
    }

    @Step('Inventory User: Create and Submit Delivery Note')
    private async executeCreateAndSubmitDeliveryNote(): Promise<void> {
        if (this.context.purchaseReceipt?.status != DocStatesEnum.TO_BILL) {
            throw new Error('Cannot create Delivery Note: Purchase Receipt is undefined or not submitted!');
        }
        if (this.context.salesOrder?.status != DocStatesEnum.TO_DELIVER_AND_BILL) {
            throw new Error('Cannot create Delivery Note: Sales Order is undefined or not submitted!');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Inventory,
            SalesFlow.INVENTORY_USERNAME
        );
        const newDeliveryNotePage = await loggedInUser
            .homePage
            .navigateTo(Navigation.STOCK)
            .then(
                stockPage => stockPage.openDeliveryNoteListPage()
            ).then(
                deliveryNoteList => deliveryNoteList.openNewDeliveryNotePage()
            );
        await newDeliveryNotePage.setCustomer(this.context.customer);
        await newDeliveryNotePage.getItemsFromSalesOrder(this.context.salesOrder);
        const deliveryNotePage = await newDeliveryNotePage.saveDocument();
        const documentName = await deliveryNotePage.getDocumentName();

        this.context.deliveryNote = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.DELIVERY_NOTE
        };
        await deliveryNotePage.submitDocument(this.context.deliveryNote);
    }
}