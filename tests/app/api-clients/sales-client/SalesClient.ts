import {ApiManager} from '../../../managers/ApiManager';
import {QUOTATION_SCHEMA, QuotationResponse, SALES_ORDER_SCHEMA, SalesOrderResponse} from './sales.schemas';

export abstract class SalesClient {
    static async getSalesOrder(
        documentName: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<SalesOrderResponse> {
        const result = await apiManager.getRecord(
            '/api/resource/Sales Order',
            documentName,
            enableSteps
        );
        return SALES_ORDER_SCHEMA.parse(result);
    }

    static async getQuotation(
        documentName: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<QuotationResponse> {
        const result = await apiManager.getRecord(
            '/api/resource/Quotation',
            documentName,
            enableSteps
        );
        return QUOTATION_SCHEMA.parse(result);
    }
}