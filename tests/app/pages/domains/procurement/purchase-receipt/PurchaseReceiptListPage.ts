import {PageManager} from '../../../../../tools/manager/PageManager';
import {BasePage} from '../../../BasePage';
import {NewPurchaseReceiptPage} from './NewPurchaseReceiptPage';

export class PurchaseReceiptListPage extends BasePage{
    private static readonly ADD_PURCHASE_RECEIPT_BUTTON: string = 'button[data-label="Add Purchase Receipt"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewPurchaseReceiptPage(): Promise<NewPurchaseReceiptPage> {
        await this.pageManager.click(
            PurchaseReceiptListPage.ADD_PURCHASE_RECEIPT_BUTTON,
            'Open New Purchase Receipt Page'
        );
        return new NewPurchaseReceiptPage(this.pageManager);
    }
}