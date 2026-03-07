import {z} from 'zod';

export interface Customer {
    customer_name: string,
    customer_type: string
}

export type CustomerResponse = z.infer<typeof CUSTOMER_RESPONSE_SCHEMA>;
export const CUSTOMER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        customer_name: z.string(),
        customer_type: z.string(),
        language: z.string()
    })
});