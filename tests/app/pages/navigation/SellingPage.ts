import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';
import {QuotationListPage} from '../sales/quotation/QuotationListPage';
import {SalesOrderListPage} from '../sales/sales-order/SalesOrderListPage';

export class SellingPage extends AbstractNavigationPage {
    private static readonly QUOTATION_BUTTON: string = 'a[title="Quotation"]';
    private static readonly SALES_ORDER_BUTTON: string = 'a[title="Sales Order"]';

    constructor(manager: PageManager) {
        super(manager);
    }

    async openQuotationListPage(): Promise<QuotationListPage> {
        await this.pageManager.click(
            SellingPage.QUOTATION_BUTTON,
            'Open Quotation List'
        );
        return new QuotationListPage(this.pageManager);
    }

    async openSalesOrderListPage(): Promise<SalesOrderListPage> {
        await this.pageManager.click(
            SellingPage.SALES_ORDER_BUTTON,
            'Open Sales Order List'
        );
        return new SalesOrderListPage(this.pageManager);
    }
}