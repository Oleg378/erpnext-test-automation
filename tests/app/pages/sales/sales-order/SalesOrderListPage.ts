import {BasePage} from '../../BasePage';
import {PageManager} from '../../../../tools/manager/PageManager';
import {NewSalesOrderPage} from './NewSalesOrderPage';

export class SalesOrderListPage extends BasePage{
    private static readonly ADD_SALES_ORDER_BUTTON: string = 'button[data-label="Add Sales Order"]';
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewSalesOrderPage(): Promise<NewSalesOrderPage> {
        await this.pageManager.click(SalesOrderListPage.ADD_SALES_ORDER_BUTTON)
        return new NewSalesOrderPage(this.pageManager);
    }
}