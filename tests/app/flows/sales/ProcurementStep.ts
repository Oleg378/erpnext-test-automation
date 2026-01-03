import {SalesFlow} from './SalesFlow';
import {SalesOrderStep} from './SalesOrderStep';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DeliveryStep} from './DeliveryStep';

export class ProcurementStep extends SalesFlow {
    constructor(flow: SalesOrderStep) {
        super(flow.getContext());
        this.pendingActions = [...flow.getPendingActions()];
    }

    /**
     * @tag User Action
     * @role Inventory
     * @returns {<this>} The current SalesFlow instance
     */
    createMaterialRequest(
        apiManager: ApiManager,
        pageManager: PageManager
    ): this {
        this.addAction(() => this.executeCreateMaterialRequest(apiManager, pageManager));
        return this;
    }

    /**
     * Must be called after .createMaterialRequest()
     * @tag User Action
     * @role Inventory
     * @returns {<this>} The current SalesFlow instance
     */
    createPurchaseOrder(
        apiManager: ApiManager,
        pageManager: PageManager
    ): this {
        this.addAction(() => this.executeCreatePurchaseOrder(apiManager, pageManager));
        return this;
    }

    /**
     * Must be called after .createMaterialRequest() and .createPurchaseOrder()
     * @tag User Action
     * @role Inventory
     * @returns new DeliveryStep instance
     */
    createPurchaseReceipt(
        apiManager: ApiManager,
        pageManager: PageManager
    ): DeliveryStep {
        this.addAction(() => this.executeCreatePurchaseReceipt(apiManager, pageManager));
        return new DeliveryStep(this);
    }


    private async executeCreateMaterialRequest(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
    }

    private async executeCreatePurchaseOrder(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
    }

    private async executeCreatePurchaseReceipt(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
    }
}