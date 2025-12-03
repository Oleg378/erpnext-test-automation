import {PageManager} from '../../../../tools/manager/PageManager';
import {SalesOrderPage} from './SalesOrderPage';

export class NewSalesOrderPage extends SalesOrderPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    override async saveDocument(): Promise<SalesOrderPage> {
        await this.save();
        return new SalesOrderPage(this.pageManager);
    }
}