import {BasePage} from '../../BasePage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {Item} from '../../../../tools/utils/record-types';
import {GridColEnum} from '../../../components/GridColEnum';
import {TestDataFactory} from '../../../../tools/utils/TestDataFactory';
import {DocStatesEnum} from '../../../../tools/utils/enums/DocStatesEnum';

export enum QUOTATION_TO_TYPES {
    customer =  'Customer',
    lead = 'Lead'
}
export enum ORDER_TYPES {
    sales = 'Sales',
    maintenance = 'Maintenance',
    shopping_cart = 'Shopping Cart'
}

export class QuotationPage extends BasePage {
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
    private static readonly SAVE_DOCUMENT_BUTTON: string = 'button[data-label="Save"]:visible';
    private static readonly DOCUMENT_STATUS: string = '.indicator-pill:visible';
    private static readonly DOCUMENT_NAME: string = '#navbar-breadcrumbs .disabled';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async setQuotationTo(quotationTo: QUOTATION_TO_TYPES, partyName: string): Promise<QuotationPage> {
        await this.pageManager.fillInput(
            QuotationPage.QUOTATION_TO_TYPE_INPUT,
            quotationTo,
            `Set "quotationTo" = "${quotationTo}"`)
        await this.pageManager.fillInput(
            QuotationPage.PARTY_INPUT,
            partyName,
            `Set "${quotationTo}" = "${partyName}"`
        )
        return this;
    }

    async setOrderType(orderType: ORDER_TYPES): Promise<QuotationPage> {
        await this.pageManager.selectOptionByVisibleText(
            QuotationPage.ORDER_TYPE_SELECT,
            orderType,
            `Set "Order type" = "${orderType}"`)
        return this;
    }

    async deleteAllRowsInItemsGrid(): Promise<QuotationPage> {
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

    async setItems(items: Map<Item, number>): Promise<QuotationPage> {
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
                )
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

    async saveQuotation(): Promise<QuotationPage> {
        await this.pageManager.click(
            QuotationPage.SAVE_DOCUMENT_BUTTON,
            'Save document');
        await this.pageManager.assertVisibleText(
            QuotationPage.DOCUMENT_STATUS,
            DocStatesEnum.DRAFT,
            `Assert Document Status is "${DocStatesEnum.DRAFT}"`)
        return this;
    }

    async updateItemQuantity(item: Item, quantity: number): Promise<QuotationPage> {
        await this.pageManager.gridRow.interactWithCell(
            item,
            GridColEnum.QUANTITY,
            this.pageManager.fillInput.bind(this.pageManager),
            quantity.toString()
        )
        return this;
    }

    async validateDataInGrid(items: Map<Item, number>): Promise<QuotationPage> {
        for (const [item, quantity] of items) {
            await this.pageManager.gridRow.interactWithCell(
                item,
                GridColEnum.QUANTITY,
                this.pageManager.assertVisibleText.bind(this.pageManager),
                quantity.toString())

            await this.pageManager.gridRow.interactWithCell(
                item,
                GridColEnum.AMOUNT,
                this.pageManager.assertVisibleText.bind(this.pageManager),
                `₪ ${quantity * TestDataFactory.DEFAULT_PRICE.selling}.00`) // inaccurate
        }
        return this;
    }

    async getQuotationDocumentName(): Promise<string> {
        return await this.pageManager.getVisibleText(
            QuotationPage.DOCUMENT_NAME,
            'Get Quotation Document Name',
            );
    }
}