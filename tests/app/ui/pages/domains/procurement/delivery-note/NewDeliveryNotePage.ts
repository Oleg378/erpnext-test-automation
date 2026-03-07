import {DeliveryNotePage} from './DeliveryNotePage';
import {PageManager} from '../../../../../../managers/PageManager';

export class NewDeliveryNotePage extends DeliveryNotePage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<DeliveryNotePage> {
        await this.save();
        return new DeliveryNotePage(this.pageManager);
    }
}