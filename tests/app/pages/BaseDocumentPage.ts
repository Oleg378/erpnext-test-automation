import {BasePage} from './BasePage';
import {PageManager} from '../../tools/manager/PageManager';
import {ErpDocument} from '../../tools/utils/record-types';
import {DocStatesEnum} from '../../tools/utils/enums/DocStatesEnum';

export class BaseDocumentPage extends BasePage{
    protected static readonly DOCUMENT_STATUS: string = '.indicator-pill:visible';
    private static readonly SAVE_DOCUMENT_BUTTON: string = 'button[data-label="Save"]:visible';
    private static readonly DOCUMENT_NAME: string = '#navbar-breadcrumbs .disabled';
    private static readonly SUBMIT_BUTTON: string = '[data-label="Submit"]:visible';
    private static readonly YES_MODAL_WINDOW_BUTTON: string = 'button:has-text("Yes")';
    private static readonly CONTEXT_ACTIONS_BUTTON: string = 'button[aria-label="Menu"]:visible';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async submitDocument(document: ErpDocument): Promise<this> {
        if (document.status !== DocStatesEnum.DRAFT) {
            throw new Error(
                `Cannot submit document. Expected status: ${DocStatesEnum.DRAFT}, ` +
                `Actual status: ${document.status}`
            );
        }
        await this.pageManager.click(BaseDocumentPage.SUBMIT_BUTTON) // click on submit button
        await this.pageManager.click(BaseDocumentPage.YES_MODAL_WINDOW_BUTTON)

        await this.pageManager.assertVisibleText(
            BaseDocumentPage.DOCUMENT_STATUS,
            DocStatesEnum.OPEN,
            `Assert Document Status is "${DocStatesEnum.OPEN}"`
        );
        document.status = DocStatesEnum.OPEN;
        return this;
    }

    protected async openContextActionsMenu(): Promise<this> {
        await this.pageManager.click(BaseDocumentPage.CONTEXT_ACTIONS_BUTTON);
        return this;
    }

    protected async save(): Promise<void> {
        await this.pageManager.click(
            BaseDocumentPage.SAVE_DOCUMENT_BUTTON,
            'Save document');
        await this.pageManager.assertVisibleText(
            BaseDocumentPage.DOCUMENT_STATUS,
            DocStatesEnum.DRAFT,
            `Assert Document Status is "${DocStatesEnum.DRAFT}"`
        );
    }

    async getDocumentName(): Promise<string> {
        return await this.pageManager.getVisibleText(
            BaseDocumentPage.DOCUMENT_NAME
        );
    }
}