import {SalesFlow} from './SalesFlow';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {AccountingStep} from './AccountingStep';
import {ProcurementStep} from './ProcurementStep';

export class DeliveryStep extends SalesFlow {
    constructor(flow: ProcurementStep) {
        super(flow.getContext());
        this.pendingActions = [...flow.getPendingActions()];
    }

    /**
     * @tag User Action
     * @role
     * @returns  new AccountingStep instance
     */
    createDeliveryNote(
        apiManager: ApiManager,
        pageManager: PageManager
    ): AccountingStep {
        this.addAction(() => this.executeCreateDeliveryNote(apiManager, pageManager));
        return new AccountingStep(this);
    }


    private async executeCreateDeliveryNote(
        apiManager: ApiManager,
        pageManager: PageManager
    ): Promise<void> {
    }
}