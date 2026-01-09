import {SalesFlow} from './SalesFlow';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DeliveryAction} from './DeliveryAction';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {Navigation} from '../../components/Navigation';
import {Step} from '../../../decorators/step.decorator';
import {DocTypesEnum} from '../../../tools/utils/enums/DocTypesEnum';
import {SalesFlowContext} from './SalesFlowInitializer';

export class ProcurementAction extends SalesFlow {
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
     * @returns current ProcurementStep instance
     */
    createAndSubmitMaterialRequest(): this {
        this.addAction(() => this.executeCreateAndSubmitMaterialRequest());
        return this;
    }

    /**
     * Must be called after .createAndSubmitMaterialRequest()
     * @tag User Action
     * @role Purchase
     * @returns current ProcurementStep instance
     */
    createAndSubmitPurchaseOrder(): this {
        this.addAction(() => this.executeCreateAndSubmitPurchaseOrder());
        return this;
    }

    /**
     * Must be called after .createAndSubmitMaterialRequest() and .createAndSubmitPurchaseOrder()
     * @tag User Action
     * @role Purchase
     * @returns new DeliveryStep
     */
    createAndSubmitPurchaseReceipt(): DeliveryAction {
        this.addAction(() => this.executeCreateAndSubmitPurchaseReceipt());
        return new DeliveryAction(this.context, this.pendingActions, this.apiManager, this.pageManager);
    }

    @Step('Inventory User: Create and Submit Material Request')
    private async executeCreateAndSubmitMaterialRequest(): Promise<void> {
        if (this.context.salesOrder?.status != DocStatesEnum.TO_DELIVER_AND_BILL) {
            throw new Error('Cannot create Material request: sales order is undefined or not submitted!');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Inventory,
            SalesFlow.INVENTORY_USERNAME
        );
        const newMaterialRequestPage = await loggedInUser
            .homePage
            .navigateTo(Navigation.STOCK)
            .then(
                stockPage => stockPage.openMaterialRequestListPage()
            ).then(
                materialRequestList => materialRequestList.openNewMaterialRequestPage()
            );
        await newMaterialRequestPage.getItemsFromSalesOrder(this.context.salesOrder)
        const materialRequest = await newMaterialRequestPage.saveDocument();
        const documentName = await materialRequest.getDocumentName();

        this.context.materialRequest = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.MATERIAL_REQUEST
        };
        await materialRequest.submitDocument(this.context.materialRequest);
    }

    @Step('Purchase User: Create and Submit Purchase Order')
    private async executeCreateAndSubmitPurchaseOrder(): Promise<void> {
        if (this.context.materialRequest?.status != DocStatesEnum.PENDING) {
            throw new Error('Cannot create Purchase order: Material request is undefined or not submitted!');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Purchase,
            SalesFlow.PURCHASE_USERNAME
        );
        const newPurchaseOrderPage = await loggedInUser
            .homePage
            .navigateTo(Navigation.BUYING)
            .then(
                buyingPage => buyingPage.openPurchaseOrderListPage()
            ).then(
                materialRequestList => materialRequestList.openNewPurchaseOrderPage()
            );
        await newPurchaseOrderPage.setSupplier(this.context.supplier);
        await newPurchaseOrderPage.getItemsFromMaterialRequest(this.context.materialRequest);
        const purchaseOrderPage = await newPurchaseOrderPage.saveDocument();
        const documentName = await purchaseOrderPage.getDocumentName();

        this.context.purchaseOrder = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.PURCHASE_ORDER
        };
        await purchaseOrderPage.submitDocument(this.context.purchaseOrder);
    }

    @Step('Purchase User: Create and Submit Purchase Receipt')
    private async executeCreateAndSubmitPurchaseReceipt(): Promise<void> {
        if (this.context.purchaseOrder?.status != DocStatesEnum.TO_RECEIVE_AND_BILL) {
            throw new Error('Cannot create Purchase Receipt: Purchase Order is undefined or not submitted!');
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
            ProfileRoles.Purchase,
            SalesFlow.PURCHASE_USERNAME
        );
        const newPurchaseReceipt = await loggedInUser
            .homePage
            .navigateTo(Navigation.STOCK)
            .then(
                stockPage => stockPage.openPurchaseReceiptListPage()
            ).then(
                purchaseReceiptList => purchaseReceiptList.openNewPurchaseReceiptPage()
            );
        await newPurchaseReceipt.setSupplier(this.context.supplier);
        await newPurchaseReceipt.getItemsPurchaseOrder(this.context.purchaseOrder);
        const purchaseReceiptPage = await newPurchaseReceipt.saveDocument();
        const documentName = await purchaseReceiptPage.getDocumentName();

        this.context.purchaseReceipt = {
            name: documentName,
            status:  DocStatesEnum.DRAFT,
            doctype: DocTypesEnum.PURCHASE_RECEIPT
        };
        await purchaseReceiptPage.submitDocument(this.context.purchaseReceipt);
    }
}