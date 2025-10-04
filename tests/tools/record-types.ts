import {ItemGroupEnum} from './stock-utils/ItemGroupEnum';
import {UOMEnum} from './stock-utils/UOMEnum';
import {z} from 'zod';

// const baseUsername = TestDataFactory.generateBaseUsername();
// const finalUsername = username || `${profileRole.role_profile_name}${baseUsername}`;
// const email = `${finalUsername}@example.com`;
export interface User {
    email: string,
    first_name: string,
    last_name: string,
    username: string,
    new_password: string,
    send_welcome_email: number,
    role_profile_name: string
}

export const USER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        full_name: z.string(),
        username: z.string(),
        send_welcome_email: z.number(),
        role_profile_name: z.string()
    })
});

export interface Customer {
    customer_name: string,
    customer_type: string
}

export const CUSTOMER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        customer_name: z.string(),
        customer_type: z.string(),
        country: z.string(),
        language: z.string()
    })
});

export interface Item {
    item_code: string, // uid
    item_name: string,
    item_group: ItemGroupEnum,
    stock_uom: UOMEnum,
    is_stock_item: number,
    is_purchase_item: number
}

export const ITEM_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        item_code: z.string(),
        item_name: z.string(),
        item_group: z.string(),
        stock_uom: z.string(),
        is_stock_item: z.string(),
        is_purchase_item: z.string()
    })
});

export interface Supplier {
    supplier_name: string
}

export const SUPPLIER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        supplier_name: z.string(),
        country: z.string(),
        supplier_type: z.string(),
        language: z.string()
    })
});

export interface Company {
    company_name: string,
    abbr: string,
    default_currency: string,
    country: string
}

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