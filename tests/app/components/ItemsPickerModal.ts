import {PageManager} from '../../tools/manager/PageManager';
import {ErpDocument} from '../../tools/utils/record-types';
import {DocTypesEnum} from '../../tools/utils/enums/DocTypesEnum';

export class ItemsPickerModal {
    private static readonly GET_ITEMS_FROM_BUTTON: string = 'button:has-text(" Get Items From ")';
    private static readonly DOC_NAME_INPUT: string = 'input[data-fieldname="search_term"]:visible';
    private static readonly GET_ITEMS_CONFIRM_BUTTON: string = 'button.btn-modal-primary:visible';

    private pageManager: PageManager;

    private constructor(pageManager: PageManager) {
        this.pageManager = pageManager;
    }

    static async transferItemsFrom(pageManager: PageManager, document: ErpDocument): Promise<void> {
        const modalWindow = new ItemsPickerModal(pageManager);
        await modalWindow.open(document.doctype);
        await modalWindow.filterListByDocumentName(document);
        await modalWindow.selectDocumentFromList(document);
    }

    private async open(docType: DocTypesEnum): Promise<void> {
        await this.pageManager.click(
            ItemsPickerModal.GET_ITEMS_FROM_BUTTON,
            'Click on "Get Items From " button'
        );

        await this.pageManager.click(
            `a:has-text("${docType}"):visible`,
            `Click on "${docType}" option in context menu`
        );
    }

    private async filterListByDocumentName(document: ErpDocument): Promise<void> {
        await this.pageManager.fillInput(
            ItemsPickerModal.DOC_NAME_INPUT,
            document.name,
            `Fill ${document.name} Name into search field`
        );
    }

    private async selectDocumentFromList(document: ErpDocument): Promise<void> {
        await this.pageManager.click(
            `input[data-item-name="${document.name}"]`,
            `Select found ${document.doctype}`
        );
        await this.pageManager.click(
            ItemsPickerModal.GET_ITEMS_CONFIRM_BUTTON,
            'Click on "Get Items" button'
        );
    }
}