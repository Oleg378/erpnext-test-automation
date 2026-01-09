import {PageManager} from '../../../../../tools/manager/PageManager';
import {BasePage} from '../../../BasePage';
import {NewDeliveryNotePage} from './NewDeliveryNotePage';

export class DeliveryNoteListPage extends BasePage{
    private static readonly ADD_DELIVERY_NOTE_BUTTON: string = 'button[data-label="Add Delivery Note"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewDeliveryNotePage(): Promise<NewDeliveryNotePage> {
        await this.pageManager.click(
            DeliveryNoteListPage.ADD_DELIVERY_NOTE_BUTTON,
            'Open New Material Request Page'
        );
        return new NewDeliveryNotePage(this.pageManager);
    }
}