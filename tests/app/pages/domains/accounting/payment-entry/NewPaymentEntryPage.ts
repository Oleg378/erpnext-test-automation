import {PaymentEntryPage} from './PaymentEntryPage';
import {PageManager} from '../../../../../tools/manager/PageManager';

export class NewPaymentEntryPage extends PaymentEntryPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<PaymentEntryPage> {
        await this.save();
        return new PaymentEntryPage(this.pageManager);
    }
}