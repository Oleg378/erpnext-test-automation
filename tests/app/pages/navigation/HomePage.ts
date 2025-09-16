import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';

export class HomePage extends AbstractNavigationPage {
    constructor(manager: PageManager) {
        super(manager);
    }
}