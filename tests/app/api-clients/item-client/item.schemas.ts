import {z} from 'zod';

export type ItemResponse = z.infer<typeof ITEM_RESPONSE_SCHEMA>
export const ITEM_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        item_code: z.string(),
        item_name: z.string(),
        item_group: z.string(),
        stock_uom: z.string(),
        is_stock_item: z.number(),
        is_purchase_item: z.number(),
        supplier_items: z.array(z.object({
            supplier: z.string()
        }))
    })
});

export type ItemPriceResponse = z.infer<typeof ITEM_PRICE_RESPONSE_SCHEMA>
export const ITEM_PRICE_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        item_code: z.string(),
        price_list: z.string(),
        price_list_rate: z.number(),
        currency: z.string()
    })
});