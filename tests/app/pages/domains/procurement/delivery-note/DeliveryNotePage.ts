import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {PageManager} from '../../../../../tools/manager/PageManager';
import {Step} from '../../../../../decorators/step.decorator';
import {Customer, ErpDocument} from '../../../../../tools/utils/record-types';
import {ItemsPickerModal} from '../../../../components/ItemsPickerModal';

export class DeliveryNotePage extends BaseDocumentPage {
    private static readonly CUSTOMER_INPUT: string = 'input[data-target="Customer"]:visible';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Delivery Note Based on Sales Order')
    async getItemsFromSalesOrder(salesOrder: ErpDocument): Promise<this> {
        await ItemsPickerModal.transferItemsFrom(this.pageManager, salesOrder);
        return this;
    }

    async setCustomer(customer: Customer): Promise<this> {
        await this.pageManager.fillInput(
            DeliveryNotePage.CUSTOMER_INPUT,
            customer.customer_name,
            `Set Customer "${customer.customer_name}" for Delivery Note`)
        await this.pageManager.pressEscape();
        return this
    }

    async saveDocument(): Promise<DeliveryNotePage> {
        await this.save();
        return this;
    }
}