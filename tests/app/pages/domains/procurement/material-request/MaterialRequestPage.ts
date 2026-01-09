import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';
import {Step} from '../../../../../decorators/step.decorator';
import {ErpDocument} from '../../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';

export class MaterialRequestPage extends BaseDocumentPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Material Request Based on Sales Order')
    async getItemsFromSalesOrder(salesOrder: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, salesOrder);
        return this;
    }

    async saveDocument(): Promise<MaterialRequestPage> {
        await this.save();
        return this;
    }
}