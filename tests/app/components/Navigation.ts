import {BasePage} from '../pages/navigation/BasePage';
import {PageManager} from '../../tools/PageManager';
import {HomePage} from '../pages/navigation/HomePage';
import {AccountingPage} from '../pages/navigation/AccountingPage';
import {PayablesPage} from '../pages/navigation/PayablesPage';
import {SellingPage} from '../pages/navigation/SellingPage';
import {StockPage} from '../pages/navigation/StockPage';

export interface NavigationTarget<T extends BasePage = BasePage> {
    readonly button: string;
    readonly visibleElement: string;
    readonly returnType: new (page: PageManager) => T;
}

export const Navigation = {
    HOME: {
        button: 'a.item-anchor[title="Home"]',
        visibleElement: 'Your Shortcuts',
        returnType: HomePage
    } as NavigationTarget<HomePage>,
    ACCOUNTING: {
        button: 'a.item-anchor[title="Accounting"]',
        visibleElement: 'Profit and Loss',
        returnType: AccountingPage
    } as NavigationTarget<AccountingPage>,
    PAYABLES: {
        button: 'a.item-anchor[title="Payables"]',
        visibleElement: 'Shortcuts',
        returnType: PayablesPage
    } as NavigationTarget<PayablesPage>,
    SELLING: {
        button: 'a.item-anchor[title="Selling"]',
        visibleElement: 'Sales Order Trends',
        returnType: SellingPage
    } as NavigationTarget<SellingPage>,
    STOCK: {
        button: 'a.item-anchor[title="Stock"]',
        visibleElement: 'Total Stock Value',
        returnType: StockPage
    } as NavigationTarget<StockPage>,
    // TODO implement missing navigation elements if needed:
    // RECEIVABLES: {
    //     locator: 'a.item-anchor[title="Receivables"]',
    //     returnType: ReceivablesPage
    // } as const,
    // FINANCIAL_REPORTS: {
    //     locator: 'a.item-anchor[title="Financial Reports"]',
    //     returnType: FinancialReportsPage
    // } as const,
    // BUYING: {
    //     locator: 'a.item-anchor[title="Buying"]',
    //     returnType: BuyingPage
    // } as const,
    // ASSETS: {
    //     locator: 'a.item-anchor[title="Assets"]',
    //     returnType: AssetsPage
    // } as const,
    // MANUFACTURING: {
    //     locator: 'a.item-anchor[title="Manufacturing"]',
    //     returnType: ManufacturingPage
    // } as const,
    // QUALITY: {
    //     locator: 'a.item-anchor[title="Quality"]',
    //     returnType: QualityPage
    // } as const,
    // PROJECTS: {
    //     locator: 'a.item-anchor[title="Projects"]',
    //     returnType: ProjectsPage
    // } as const,
    // SUPPORT: {
    //     locator: 'a.item-anchor[title="Support"]',
    //     returnType: SupportPage
    // } as const,
    // USERS: {
    //     locator: 'a.item-anchor[title="Users"]',
    //     returnType: UsersPage
    // } as const,
    // WEBSITE: {
    //     locator: 'a.item-anchor[title="Website"]',
    //     returnType: WebsitePage
    // } as const,
    // CRM: {
    //     locator: 'a.item-anchor[title="CRM"]',
    //     returnType: CrmPage
    // } as const,
    // TOOLS: {
    //     locator: 'a.item-anchor[title="Tools"]',
    //     returnType: ToolsPage
    // } as const,
    // ERPNEXT_SETTINGS: {
    //     locator: 'a.item-anchor[title="ERPNext Settings"]',
    //     returnType: ERPNextSettingsPage
    // } as const,
    // INTEGRATIONS: {
    //     locator: 'a.item-anchor[title="Integrations"]',
    //     returnType: IntegrationsPage
    // } as const,
    // ERPNEXT_INTEGRATIONS: {
    //     locator: 'a.item-anchor[title="ERPNext Integrations"]',
    //     returnType: ERPNextIntegrationsPage
    // } as const,
    // BUILD: {
    //     locator: 'a.item-anchor[title="Build"]',
    //     returnType: BuildPage
    // } as const
} as const;