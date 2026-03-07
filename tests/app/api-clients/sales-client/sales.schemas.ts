import {z} from 'zod';

export type SalesOrderResponse = z.infer<typeof SALES_ORDER_SCHEMA>;
export const SALES_ORDER_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        customer: z.string(),
        customer_name: z.string(),
        transaction_date: z.string(),
        total: z.number(),
        status: z.string(),
        delivery_status: z.string(),
        billing_status: z.string(),
        doctype: z.string(),
        items: z.array(
            z.object({
                item_code: z.string(),
                item_name: z.string(),
                qty: z.number(),
                rate: z.number(),
                amount: z.number(),
            })
        ),
        payment_schedule: z.array(
            z.object({
                due_date: z.string(),
                payment_amount: z.number(),
            })
        ).optional(),
    })
});

export type QuotationResponse = z.infer<typeof QUOTATION_SCHEMA>;
export const QUOTATION_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        quotation_to: z.string(),
        party_name: z.string(),
        customer_name: z.string(),
        transaction_date: z.string(),
        valid_till: z.string(),
        total: z.number(),
        status: z.string(),
        doctype: z.string(),
        items: z.array(
            z.object({
                item_code: z.string(),
                item_name: z.string(),
                qty: z.number(),
                rate: z.number(),
                amount: z.number(),
            })
        ),
        payment_schedule: z.array(
            z.object({
                due_date: z.string(),
                payment_amount: z.number(),
            })
        ).optional(),
    })
});