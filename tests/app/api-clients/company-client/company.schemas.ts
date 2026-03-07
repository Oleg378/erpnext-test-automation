import {z} from 'zod';

export interface Company {
    company_name: string,
    abbr: string,
    default_currency: string,
    country: string
}

export type CompanyResponse = z.infer<typeof COMPANY_RESPONSE_SCHEMA>;
export const COMPANY_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        company_name: z.string(),
        abbr: z.string(),
        default_currency: z.string(),
        country: z.string(),
        is_group: z.number()
    })
});