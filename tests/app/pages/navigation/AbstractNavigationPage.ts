import {PageManager} from '../../../tools/manager/PageManager';
import {NavigationTarget} from '../../components/Navigation';
import {BasePage} from '../BasePage';

export class AbstractNavigationPage extends BasePage{
    constructor(manager: PageManager) {
        super(manager);
    }

    async navigateTo<T extends AbstractNavigationPage>(section: NavigationTarget<T>): Promise<T> {
        await this.pageManager.click(section.button, `navigate to ${section.returnType.name}`);
        await this.pageManager.locateElementByText(section.visibleText);
        return new section.returnType(this.pageManager);
    }
}