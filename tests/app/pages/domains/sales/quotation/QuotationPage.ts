import {PageManager} from '../../../../../tools/manager/PageManager';
import {Item} from '../../../../../tools/utils/record-types';
import {GridColEnum} from '../../../../components/GridColEnum';
import {TestDataFactory} from '../../../../../tools/utils/TestDataFactory';
import {BaseDocumentPage} from '../../../BaseDocumentPage';
import {Step} from '../../../../../decorators/step.decorator';

export enum QUOTATION_TO_TYPES {
    customer =  'Customer',
    lead = 'Lead'
}
export enum ORDER_TYPES {
    sales = 'Sales',
    maintenance = 'Maintenance',
    shopping_cart = 'Shopping Cart'
}

export class QuotationPage extends BaseDocumentPage {
    private static readonly QUOTATION_TO_TYPE_INPUT: string = 'input[data-fieldname="quotation_to"]:visible';
    private static readonly PARTY_INPUT: string = 'input[data-fieldname="party_name"]:visible';
    private static readonly ORDER_TYPE_SELECT: string = 'select[data-fieldname="order_type"]:visible';
    private static readonly ADD_MULTIPLE_ROWS_BUTTON: string = 'button.grid-add-multiple-rows:visible';
    private static readonly QUANTITY_FOR_NEW_ITEM_INPUT: string = 'input.input-with-feedback[data-fieldname="qty"]:visible';
    private static readonly SELECT_ALL_ITEMS_CHECKBOX: string = '[data-idx="1"] input[type="checkbox"]';
    private static readonly DELETE_ALL_ROWS_BUTTON: string = 'button[data-action="delete_rows"]:visible';
    private static readonly MODAL_WINDOW_SEARCH_INPUT: string = 'input.input-with-feedback[data-fieldname="txt"]:visible';
    private static readonly MODAL_WINDOW_SEARCH_BUTTON: string = 'button:has-text("Search"):visible';
    private static readonly MODAL_WINDOW_SET_QUANTITY_BUTTON : string = 'button:has-text("Set Quantity"):visible';
    private static readonly CLOSE_MODAL_WINDOW_BUTTON: string = '.btn-modal-close:visible';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    @Step('Set Quotation recipient:')
    async setQuotationTo(quotationTo: QUOTATION_TO_TYPES, partyName: string): Promise<this> {
        await this.pageManager.fillInput(
            QuotationPage.QUOTATION_TO_TYPE_INPUT,
            quotationTo,
            `Set "quotationTo" = "${quotationTo}"`
        );
        await this.pageManager.fillInput(
            QuotationPage.PARTY_INPUT,
            partyName,
            `Set "${quotationTo}" = "${partyName}"`
        );
        return this;
    }

    async setOrderType(orderType: ORDER_TYPES): Promise<this> {
        await this.pageManager.selectOptionByVisibleText(
            QuotationPage.ORDER_TYPE_SELECT,
            orderType,
            `Set "Order type" = "${orderType}"`)
        return this;
    }

    async deleteAllRowsInItemsGrid(): Promise<this> {
        await this.pageManager.click(
            QuotationPage.SELECT_ALL_ITEMS_CHECKBOX,
            'Select all Rows in Items Grid'
        );
        await this.pageManager.click(
            QuotationPage.DELETE_ALL_ROWS_BUTTON,
            'Click on "Delete all rows" button'
        );
        return this;
    }

    @Step('Add Items to Quotation')
    async setItems(items: Map<Item, number>): Promise<this> {
        await this.deleteAllRowsInItemsGrid();

        await this.pageManager.click(
            QuotationPage.ADD_MULTIPLE_ROWS_BUTTON,
            'Open modal window for adding multiple items'
        );
        for (const [item, quantity] of items) {
            await this.pageManager.fillInput(
                QuotationPage.MODAL_WINDOW_SEARCH_INPUT,
                item.item_code,
                `Fill in "${item.item_code}"`
            );
            await this.pageManager.click(
                QuotationPage.MODAL_WINDOW_SEARCH_BUTTON,
                `Click Search Button`
            );
            await this.pageManager.click(
                `a[data-value="${item.item_code}"]`,
                `Select Item "${item.item_code}"`
            );
            await this.pageManager.fillInput(
                QuotationPage.QUANTITY_FOR_NEW_ITEM_INPUT,
                quantity.toString(),
                `Fill Item Quantity: "${quantity}"`
            );
            await this.pageManager.click(
                QuotationPage.MODAL_WINDOW_SET_QUANTITY_BUTTON,
                'Click on Set Quantity button'
            );
        }
        await this.pageManager.click(
            QuotationPage.CLOSE_MODAL_WINDOW_BUTTON,
            'Close modal window'
            );
        return this;
    }

    async updateItemQuantity(item: Item, quantity: number): Promise<this> {
        await this.pageManager.gridRow.interactWithCell(
            item,
            GridColEnum.QUANTITY,
            this.pageManager.fillInput.bind(this.pageManager),
            quantity.toString()
        );
        return this;
    }

    @Step('Ensure Items are in Quotation')
    async validateItemsInGrid(items: Map<Item, number>): Promise<this> {
        for (const [item, quantity] of items) {
            await this.pageManager.gridRow.interactWithCell(
                item,
                GridColEnum.QUANTITY,
                this.pageManager.assertVisibleText.bind(this.pageManager),
                quantity.toString()
            );

            await this.pageManager.gridRow.interactWithCell(
                item,
                GridColEnum.AMOUNT,
                this.pageManager.assertVisibleText.bind(this.pageManager),
                `₪ ${QuotationPage.splitNumberByCommas(quantity * TestDataFactory.DEFAULT_PRICE.selling)}.00`
            ); // inaccurate
        }
        return this;
    }

    private static splitNumberByCommas(num: number): string {
        return new Intl.NumberFormat('en-US').format(Number(num));
    }

    async saveDocument(): Promise<QuotationPage> {
        await this.save();
        return this;
    }
}