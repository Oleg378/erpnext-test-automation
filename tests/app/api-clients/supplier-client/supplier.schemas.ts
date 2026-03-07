import {z} from 'zod';

export type SupplierResponse = z.infer<typeof SUPPLIER_RESPONSE_SCHEMA>;
export const SUPPLIER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        supplier_name: z.string(),
        country: z.string(),
        supplier_type: z.string(),
        language: z.string()
    })
});