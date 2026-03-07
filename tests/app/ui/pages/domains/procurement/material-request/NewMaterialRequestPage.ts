import {MaterialRequestPage} from './MaterialRequestPage';
import {PageManager} from '../../../../../../managers/PageManager';

export class NewMaterialRequestPage extends MaterialRequestPage {
    constructor(pageManager: PageManager) {
        super(pageManager);
    }
    override async saveDocument(): Promise<MaterialRequestPage> {
        await this.save();
        return new MaterialRequestPage(this.pageManager);
    }
}