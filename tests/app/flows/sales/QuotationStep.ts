import {SalesFlowInitializer} from './SalesFlowInitializer';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {QuotationListPage} from '../../pages/sales/quotation/QuotationListPage';
import {Navigation} from '../../components/Navigation';
import {QuotationPage} from '../../pages/sales/quotation/QuotationPage';
import {SalesFlow} from './SalesFlow';
import {SalesOrderStep} from './SalesOrderStep';

export class QuotationStep extends SalesFlow {
    constructor(flow: SalesFlowInitializer) {
        super(flow.getContext());
        this.pendingActions = [...flow.getPendingActions()]
    }

    /**
     * @tag User Action
     * @role Sales
     * @returns new SalesOrderStep
     */
   submitQuotation(
       apiManager: ApiManager,
       pageManager: PageManager
   ): SalesOrderStep {
        this.addAction(() => this.executeSubmitQuotation(apiManager, pageManager));
        return new SalesOrderStep(this);
   }

    @Step(`Submit Quotation as Sales User`)
    private async executeSubmitQuotation(
        apiManager: ApiManager,
        pageManager: PageManager
    ) : Promise<void> {
        if (this.context.quotation?.status !== DocStatesEnum.DRAFT) {
            throw new Error(
                `Impossible to proceed, Quotation status is: 
                '${this.context.quotation?.status}', but expected: 'Draft'`);
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            apiManager,
            pageManager,
            ProfileRoles.Sales,
            SalesFlow.SALES_USERNAME
        );
        const quotationListPage: QuotationListPage = await loggedInUser
            .homePage
            .navigateTo(Navigation.SELLING)
            .then(sellingPage =>
                sellingPage.openQuotationListPage());
        const quotationPage: QuotationPage = await quotationListPage.openQuotationByDocumentName(this.context.quotation.name);
        await quotationPage.submitDocument(this.context.quotation);
    }
}