import {PageManager} from '../../../../../../managers/PageManager';
import {ErpDocument} from '../../../../../types/document.type';
import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {Step} from '../../../../../../decorators/step.decorator';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';

export class SalesOrderPage extends BaseDocumentPage {
    private static readonly DELIVERY_DATE_INPUT: string = 'input[data-fieldname="delivery_date"]:visible';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Sales order Based on Quotation')
    async getItemsFromQuotation(quotation: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, quotation);
        return this;
    }

    async saveDocument(): Promise<SalesOrderPage> {
        await this.save();
        return this;
    }

    async setDeliveryDate(date: Date): Promise<this> {
        await this.pageManager.fillDate(SalesOrderPage.DELIVERY_DATE_INPUT, date, 'Fill delivery Date');
        return this;
    }
}