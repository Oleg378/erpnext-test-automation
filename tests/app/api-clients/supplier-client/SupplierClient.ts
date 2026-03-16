import {ApiManager} from '../../../managers/ApiManager';
import {expect} from '@playwright/test';
import {SUPPLIER_RESPONSE_SCHEMA, SupplierResponse} from './supplier.schemas';
import {Supplier} from '../../types/supplier.type';
import {Step} from '../../../decorators/step.decorator';

export abstract class SupplierClient {
    @Step('Create new Supplier')
    static async postCreateNewSupplier(
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<SupplierResponse> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Supplier',
            'Supplier',
            supplier,
            enableSteps
        );
        const parsedResponse: SupplierResponse = SUPPLIER_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.supplier_name,
            `"supplier_name" should be "${result.request_body.supplier_name}"`
        ).toBe(result.request_body.supplier_name);
        expect(
            parsedResponse.data.name,
            '"name" should equal "supplier_name"'
        ).toBe(result.request_body.supplier_name);
        expect(
            parsedResponse.data.supplier_type,
            '"supplier_type" should be "Company"'
        ).toBe('Company');

        return parsedResponse;
    }

    static async isSupplierExists(
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Supplier',
            supplier.supplier_name,
            enableSteps
        );
    }
}