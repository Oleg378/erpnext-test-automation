import {BasePage} from '../../BasePage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {Item} from '../../../../tools/utils/record-types';

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
    private static readonly QUOTATION_TO_INPUT: string = 'input[data-fieldname="quotation_to"]:visible';

    private static readonly PARTY_INPUT: string = 'input[data-fieldname="party_name"]:visible';
    private static readonly ORDER_TYPE_SELECT = 'select[data-fieldname="order_type"]:visible';
    private itemsMap = new Map<number, Item>();

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async setQuotationTo(quotationTo: QUOTATION_TO_TYPES, partyName: string): Promise<QuotationPage> {
        await this.pageManager.fillInput(
            QuotationPage.QUOTATION_TO_INPUT,
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

    async setItems(items: Item[]): Promise<QuotationPage> {
        for (let i  = 0; i < items.length; i++) {
            this.itemsMap.set(i + 1, items[i]);
        }

        return this;
    }



}