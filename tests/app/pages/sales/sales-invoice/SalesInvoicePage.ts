import {BaseDocumentPage} from '../../BaseDocumentPage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {ErpDocument} from '../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../components/ItemsPickerModal';
import {Step} from '../../../../decorators/step.decorator';

export class SalesInvoicePage extends BaseDocumentPage {

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Sales Invoice Based on Sales Order')
    async getItemsFromSalesOrder(salesOrder: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, salesOrder);
        return this;
    }


        async saveDocument(): Promise<SalesInvoicePage> {
        await this.save();
        return this;
    }
}