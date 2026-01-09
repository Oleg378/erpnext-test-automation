import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';
import {ErpDocument} from '../../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';
import {Step} from '../../../../../decorators/step.decorator';
import {NewPaymentEntryPage} from '../../accounting/payment-entry/NewPaymentEntryPage';

export class SalesInvoicePage extends BaseDocumentPage {
    private static readonly CREATE_MENU_BUTTON: string = 'button:has-text("Create"):visible'
    private static readonly PAYMENT_ENTRY_OPTION: string = 'a[data-label="Payment"]:visible'

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

    @Step('Create Payment Entry for current Sales Invoice')
    async createPaymentEntryViaContextMenu(): Promise<NewPaymentEntryPage> {
        await this.pageManager.click(SalesInvoicePage.CREATE_MENU_BUTTON);
        await this.pageManager.click(SalesInvoicePage.PAYMENT_ENTRY_OPTION);
        return new NewPaymentEntryPage(this.pageManager);
    }
}