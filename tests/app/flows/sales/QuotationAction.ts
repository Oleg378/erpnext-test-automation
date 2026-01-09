import {SalesFlowContext} from './SalesFlowInitializer';
import {Step} from '../../../decorators/step.decorator';
import {ApiManager} from '../../../tools/manager/ApiManager';
import {PageManager} from '../../../tools/manager/PageManager';
import {DocStatesEnum} from '../../../tools/utils/enums/DocStatesEnum';
import {LoggedInUser, LogInUtils} from '../../../tools/utils/LogInUtils';
import {ProfileRoles} from '../../../tools/ProfileRoles';
import {QuotationListPage} from '../../pages/domains/sales/quotation/QuotationListPage';
import {Navigation} from '../../components/Navigation';
import {QuotationPage} from '../../pages/domains/sales/quotation/QuotationPage';
import {SalesFlow} from './SalesFlow';
import {SalesOrderAction} from './SalesOrderAction';

export class QuotationAction extends SalesFlow {
    constructor(
        context: SalesFlowContext,
        pendingActions: Array<() => Promise<void>>,
        apiManager: ApiManager,
        pageManager: PageManager
    ) {
        super(context, pendingActions, apiManager, pageManager);
    }

    /**
     * @tag User Action
     * @role Sales
     * @returns new SalesOrderStep
     */
   submitQuotation(): SalesOrderAction {
        this.addAction(() => this.executeSubmitQuotation());
        return new SalesOrderAction(this.context, this.pendingActions, this.apiManager, this.pageManager);
   }

    @Step('Sales User: Submit Quotation')
    private async executeSubmitQuotation() : Promise<void> {
        if (this.context.quotation?.status !== DocStatesEnum.DRAFT) {
            throw new Error(
                `Impossible to proceed, Quotation status is: 
                '${this.context.quotation?.status}', but expected: 'Draft'`);
        }
        const loggedInUser: LoggedInUser = await LogInUtils.ensureUserLoggedIn(
            this.apiManager,
            this.pageManager,
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