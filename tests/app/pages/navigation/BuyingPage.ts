import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';
import {PurchaseOrderListPage} from '../domains/procurement/purchase-order/PurchaseOrderListPage';

export class BuyingPage extends AbstractNavigationPage {
    private static readonly PURCHASE_ORDER_BUTTON: string = 'a[title="Purchase Order"]';
    constructor(manager: PageManager) {
        super(manager);
    }

    async openPurchaseOrderListPage(): Promise<PurchaseOrderListPage> {
        await this.pageManager.click(
            BuyingPage.PURCHASE_ORDER_BUTTON,
            'Open Purchase Order List'
        );
        return new PurchaseOrderListPage(this.pageManager);
    }
}