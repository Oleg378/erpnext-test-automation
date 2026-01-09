import {PageManager} from '../../../../../tools/manager/PageManager';
import {PurchaseReceiptPage} from './PurchaseReceiptPage';

export class NewPurchaseReceiptPage extends PurchaseReceiptPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<PurchaseReceiptPage> {
        await this.save();
        return new PurchaseReceiptPage(this.pageManager);
    }
}