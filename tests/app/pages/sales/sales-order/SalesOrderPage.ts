import {PageManager} from '../../../../tools/manager/PageManager';
import {Customer, ErpDocument} from '../../../../tools/utils/record-types';
import {BaseDocumentPage} from '../../BaseDocumentPage';
import {Step} from '../../../../decorators/step.decorator';

export class SalesOrderPage extends BaseDocumentPage {
    private static readonly GET_ITEMS_FROM_BUTTON: string = 'button:has-text(" Get Items From ")';
    private static readonly GET_FROM_QUOTATION_BUTTON: string = 'a[data-label="Quotation"]';
    private static readonly QUOTATION_NAME_INPUT: string = 'input[data-fieldname="search_term"]:visible';
    private static readonly CUSTOMER_NAME_INPUT: string = 'input[data-fieldname="party_name"]:visible';
    private static readonly GET_ITEMS_CONFIRM_BUTTON: string = 'button.btn-modal-primary:visible';
    private static readonly DELIVERY_DATE_INPUT: string = 'input[data-fieldname="delivery_date"]:visible';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Fill Items in Sales order Based on Quotation')
    async getItemsFromQuotation(quotation: ErpDocument, customer: Customer): Promise<this> {
        await this.pageManager.click(
            SalesOrderPage.GET_ITEMS_FROM_BUTTON,
            'Click on "Get Items From " button'
        );
        await this.pageManager.click(
            SalesOrderPage.GET_FROM_QUOTATION_BUTTON,
            'Click on "Quotation" option in context menu'
        );
        await this.pageManager.fillInput(
            SalesOrderPage.QUOTATION_NAME_INPUT,
            quotation.name,
            'Fill Quotation Name'
        );
        await this.pageManager.fillInput(
            SalesOrderPage.CUSTOMER_NAME_INPUT,
            customer.customer_name,
            'Fill Customer Name'
        );
        await this.pageManager.click(
            `input[data-item-name="${quotation.name}"]`,
            'Select found Quotation'
        ); // quotation selector button
        await this.pageManager.click(
            SalesOrderPage.GET_ITEMS_CONFIRM_BUTTON,
            'Click on "Confirm" button'
        ); // Get Items

        return this;
    }

    async saveDocument(): Promise<SalesOrderPage> {
        await this.save();
        return this;
    }

    async setDeliveryDate(date: Date): Promise<this> {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        await this.pageManager.fillDate(SalesOrderPage.DELIVERY_DATE_INPUT, formattedDate, 'Fill delivery Date');

        return this;
    }
}