import {BasePage} from './BasePage';
import {PageManager} from '../../tools/manager/PageManager';

export class AbstractListOfDocumentsPage extends BasePage {
    private static readonly FILTER_BY_DOCUMENT_MANE_INPUT: string = 'input[data-fieldname="name"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    protected async openDocumentByName(name: string):  Promise<void> {
        await this.pageManager.fillInput(
            AbstractListOfDocumentsPage.FILTER_BY_DOCUMENT_MANE_INPUT,
            name,
            'Fill filter by Document Name'
        );
        await this.pageManager.click(
            `a[data-name="${name}"]`
            , 'Click on Document in list'
        );
    }

}