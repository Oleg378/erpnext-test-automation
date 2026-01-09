import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';

export class PaymentEntryPage extends BaseDocumentPage {
    private static readonly REFERENCE_NUMBER_INPUT: string = 'input[data-fieldname="reference_no"]:visible'

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async setReferenceNumber(referenceNumber: string):  Promise<this> {
        await this.pageManager.fillInput(PaymentEntryPage.REFERENCE_NUMBER_INPUT, referenceNumber)
        return this;
    }

    async saveDocument(): Promise<PaymentEntryPage> {
        await this.save();
        return this;
    }
}