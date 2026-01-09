import {AbstractNavigationPage} from './AbstractNavigationPage';
import {PageManager} from '../../../tools/manager/PageManager';
import {MaterialRequestListPage} from '../domains/procurement/material-request/MaterialRequestListPage';
import {PurchaseReceiptListPage} from '../domains/procurement/purchase-receipt/PurchaseReceiptListPage';
import {DeliveryNoteListPage} from '../domains/procurement/delivery-note/DeliveryNoteListPage';

export class StockPage extends AbstractNavigationPage {
    private static readonly MATERIAL_REQUEST_BUTTON: string = 'a[title="Material Request"]';
    private static readonly PURCHASE_RECEIPT_BUTTON: string = 'a[title="Purchase Receipt"]';
    private static readonly DELIVERY_NOTE_BUTTON: string = 'a[title="Delivery Note"]';

    constructor(manager: PageManager) {
        super(manager);
    }

    async openMaterialRequestListPage(): Promise<MaterialRequestListPage> {
        await this.pageManager.click(
            StockPage.MATERIAL_REQUEST_BUTTON,
            'Open Material Request List'
        );
        return new MaterialRequestListPage(this.pageManager);
    }

    async openPurchaseReceiptListPage(): Promise<PurchaseReceiptListPage> {
        await this.pageManager.click(
            StockPage.PURCHASE_RECEIPT_BUTTON,
            'Open Purchase Receipt List'
        );
        return new PurchaseReceiptListPage(this.pageManager);
    }

    async openDeliveryNoteListPage(): Promise<DeliveryNoteListPage> {
        await this.pageManager.click(
            StockPage.DELIVERY_NOTE_BUTTON,
            'Open Delivery Note List'
        );
        return new DeliveryNoteListPage(this.pageManager);
    }
}