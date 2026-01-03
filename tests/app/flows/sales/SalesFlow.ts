import {SalesFlowContext} from './SalesFlowInitializer';

export abstract class SalesFlow {
    protected static readonly SALES_USERNAME: string = 'Sales_User';
    protected static readonly ACCOUNTING_USERNAME: string = 'Accounting_User';

    protected context: SalesFlowContext;
    protected pendingActions: Array<() => Promise<void>> = [];


    protected constructor(context: SalesFlowContext) {
        this.context = context;
    }

    getContext(): SalesFlowContext {
        return this.context;
    }

    getPendingActions(): Array<() => Promise<void>> {
        return this.pendingActions;
    }

    protected addAction(action: () => Promise<void>): void {
        this.pendingActions.push(action);
    }

    async executeAll(): Promise<void> {
        for (const action of this.pendingActions) {
            await action();
        }
        this.pendingActions = [];
    }
}