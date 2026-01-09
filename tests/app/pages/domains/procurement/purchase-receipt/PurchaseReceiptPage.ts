import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';
import {Step} from '../../../../../decorators/step.decorator';
import {ErpDocument, Supplier} from '../../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';

export class PurchaseReceiptPage extends BaseDocumentPage {
    private static readonly SUPPLIER_INPUT = 'input[data-target="Supplier"]:visible'
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Purchase Receipt Based on Purchase Order')
    async getItemsPurchaseOrder(purchaseOrder: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, purchaseOrder);
        return this;
    }

    async setSupplier(supplier: Supplier): Promise<this> {
        await this.pageManager.fillInput(
            PurchaseReceiptPage.SUPPLIER_INPUT,
            supplier.supplier_name,
            `Set Supplier "${supplier.supplier_name}" for Purchase Receipt`)
        await this.pageManager.pressEscape();
        return this
    }

    async saveDocument(): Promise<PurchaseReceiptPage> {
        await this.save();
        return this;
    }
}