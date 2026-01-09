import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';
import {Step} from '../../../../../decorators/step.decorator';
import {ErpDocument, Supplier} from '../../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';

export class PurchaseOrderPage extends BaseDocumentPage {
    private static readonly SUPPLIER_INPUT: string = 'input[data-target="Supplier"]:visible'
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Material Request Based on Sales Order')
    async getItemsFromMaterialRequest(materialRequest: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, materialRequest);
        return this;
    }

    async setSupplier(supplier: Supplier): Promise<this> {
        await this.pageManager.fillInput(
            PurchaseOrderPage.SUPPLIER_INPUT,
            supplier.supplier_name,
            `Set Supplier "${supplier.supplier_name}" for Purchase Order`)
        await this.pageManager.pressEscape();
        return this
    }

    async saveDocument(): Promise<PurchaseOrderPage> {
        await this.save();
        return this;
    }
}