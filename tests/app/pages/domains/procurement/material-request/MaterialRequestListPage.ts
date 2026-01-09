import {PageManager} from '../../../../../tools/manager/PageManager';
import {BasePage} from '../../../BasePage';
import {NewMaterialRequestPage} from './NewMaterialRequestPage';

export class MaterialRequestListPage extends BasePage{
    private static readonly ADD_MATERIAL_REQUEST_BUTTON: string = 'button[data-label="Add Material Request"]';

    constructor(pageManager: PageManager) {
        super(pageManager);
    }

    async openNewMaterialRequestPage(): Promise<NewMaterialRequestPage> {
        await this.pageManager.click(
            MaterialRequestListPage.ADD_MATERIAL_REQUEST_BUTTON,
            'Open New Material Request Page'
        );
        return new NewMaterialRequestPage(this.pageManager);
    }
}