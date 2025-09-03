import {PageManager} from "../../../tools/PageManager";
import {NavigationTarget} from "../../components/Navigation";

export class BasePage {
    private readonly manager: PageManager;

    constructor(manager: PageManager) {
        this.manager = manager;
    }

    async navigateTo<T extends BasePage>(section: NavigationTarget<T>): Promise<T> {
        await this.manager.click(section.button);
        //await this.manager.assertElementIsVisible(section.visibleElement);
        await this.manager.locateElementByText(section.visibleElement);
        return new section.returnType(this.manager);
    }
}