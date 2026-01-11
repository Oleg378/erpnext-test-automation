import {SalesFlowContext} from './SalesFlowInitializer';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';

export abstract class SalesFlow {
    protected static readonly SALES_USERNAME: string = 'Sales_User';
    protected static readonly ACCOUNTING_USERNAME: string = 'Accounting_User';
    protected static readonly INVENTORY_USERNAME: string = 'Inventory_User';
    protected static readonly PURCHASE_USERNAME: string = 'Purchase_User';

    protected constructor(
        protected context: SalesFlowContext,
        protected pendingActions: Array<() => Promise<void>> = [],
        protected apiManager: ApiManager,
        protected pageManager: PageManager) {
        this.pendingActions = [...pendingActions]
    }

    protected addAction(action: () => Promise<void>): void {
        this.pendingActions.push(action);
    }

    async executeAll(): Promise<this> {
        for (const action of this.pendingActions) {
            await action();
        }
        this.pendingActions = [];
        await this.pageManager.closePage();
        return this
    }

    setManager(apiManager: ApiManager, pageManager: PageManager): this {
        this.pageManager = pageManager;
        this.apiManager = apiManager;
        return this;
    }

    getContext(): SalesFlowContext {
        return this.context;
    }
}