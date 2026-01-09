import {PageManager} from '../../../../../tools/manager/PageManager';
import {PurchaseOrderPage} from './PurchaseOrderPage';

export class NewPurchaseOrderPage extends PurchaseOrderPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<PurchaseOrderPage> {
        await this.save();
        return new PurchaseOrderPage(this.pageManager);
    }
}