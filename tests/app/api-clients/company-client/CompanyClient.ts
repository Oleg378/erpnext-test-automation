import {ApiManager} from '../../../managers/ApiManager';
import {expect} from '@playwright/test';
import {Company} from '../../types/company.type';
import {COMPANY_RESPONSE_SCHEMA, CompanyResponse} from './company.schemas';
import {Step} from '../../../decorators/step.decorator';

export abstract class CompanyClient {
    @Step('Create new Company')
    static async postCreateNewCompany(
        company: Company,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<CompanyResponse> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Company',
            'Company',
            company,
            enableSteps
        );
        const parsedResponse: CompanyResponse = COMPANY_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "company_name"'
        ).toBe(parsedResponse.data.company_name);
        expect(
            parsedResponse.data.company_name,
            `"company_name" should equal "${result.request_body.company_name}"`
        ).toBe(result.request_body.company_name);
        expect(
            parsedResponse.data.abbr,
            `"abbr" should equal "${result.request_body.abbr}"`
        ).toBe(result.request_body.abbr);

        return parsedResponse;
    }

    static async getListOfCompanies(
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<string[]> {
        return apiManager.getAllRecords(
            '/api/resource/Company',
            'Companies',
            enableSteps);
    }

    static async isCompanyExists(
        companyName: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Company',
            companyName,
            enableSteps
        );
    }
}