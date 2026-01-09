import {PageManager} from '../../../../../tools/manager/PageManager';
import {BasePage} from '../../../BasePage';
import {NewPurchaseOrderPage} from './NewPurchaseOrderPage';

export class PurchaseOrderListPage extends BasePage{
    private static readonly ADD_PURCHASE_ORDER_BUTTON: string = 'button[data-label="Add Purchase Order"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewPurchaseOrderPage(): Promise<NewPurchaseOrderPage> {
        await this.pageManager.click(
            PurchaseOrderListPage.ADD_PURCHASE_ORDER_BUTTON,
            'Open New Purchase Order Page'
        );
        return new NewPurchaseOrderPage(this.pageManager);
    }
}