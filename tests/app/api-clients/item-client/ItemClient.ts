import {ApiManager} from '../../../managers/ApiManager';
import {expect} from '@playwright/test';
import {z} from 'zod';
import {Step} from '../../../decorators/step.decorator';
import {ITEM_PRICE_RESPONSE_SCHEMA, ITEM_RESPONSE_SCHEMA, ItemPriceResponse, ItemResponse} from './item.schemas';
import {Item} from '../../types/item.type';
import {Supplier} from '../../types/supplier.type';

export abstract class ItemClient {
    @Step('Create new Item')
    static async postCreateNewItem(
        item: Item,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<ItemResponse> {
        const result = await apiManager.postCreateRecord(
            '/api/resource/Item',
            'Item',
            item,
            enableSteps
        );
        const parsedResponse: ItemResponse = ITEM_RESPONSE_SCHEMA.parse(result.response_body);

        expect(
            parsedResponse.data.name,
            '"name" should equal "item_code"'
        ).toBe(parsedResponse.data.item_code);
        expect(
            parsedResponse.data.item_code,
            `"item_code" should be ${result.request_body.item_code}`
        ).toBe(result.request_body.item_code);
        expect(
            parsedResponse.data.item_name,
            `"item_name" should be ${result.request_body.item_name}`
        ).toBe(result.request_body.item_name);
        expect(
            parsedResponse.data.item_group,
            `"item_group" should be ${result.request_body.item_group}`
        ).toBe(result.request_body.item_group);
        expect(
            parsedResponse.data.stock_uom,
            `"stock_uom" should be ${result.request_body.stock_uom}`
        ).toBe(result.request_body.stock_uom);

        return parsedResponse;
    }

    static async isItemExists(
        apiManager: ApiManager,
        item: Item,
        enableSteps: boolean = true
    ): Promise<boolean> {
        return await apiManager.isRecordExists(
            '/api/resource/Item',
            item.item_code,
            enableSteps
        );
    }

    static async isItemPriceExists(
        item: Item,
        priceList: string,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<boolean> {
        const responseSchema = z.object({
            message: z.array(
                z.object({
                    name: z.string(), // item price document name
                    item_code: z.string(),
                    price_list: z.string(),
                    price_list_rate: z.number(),
                })
            )
        });

        const response = await apiManager.getListOf(
            'Item Price',
            ["name", "item_code", "price_list", "price_list_rate"],
            [["item_code", "=", item.item_code]],
            enableSteps
        );
        const parsedData = responseSchema.parse(response);
        const itemsFromResponse: string[] = parsedData.message.map(item => item.item_code)
        for (const index of itemsFromResponse) {
            expect(
                index,
                `Item code from response should be ${item.item_code}`
            ).toBe(item.item_code);
        }
        return parsedData.message.filter(
            item => item.price_list === priceList
        ).length > 0;
    }

    @Step('Update Price for Item')
    static async postPriceForItem(
        item: Item,
        priceList: string,
        priceRate: number,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<ItemPriceResponse> {
        const itemPrice = {
            item_code: item.item_code,
            price_list: priceList,
            price_list_rate: priceRate
        }
        const result = await apiManager.postCreateRecord(
            '/api/resource/Item Price',
            'Item Price',
            itemPrice,
            enableSteps
        );
        const parsedResponse: ItemPriceResponse = ITEM_PRICE_RESPONSE_SCHEMA.parse(result.response_body);
        expect(
            parsedResponse.data.price_list,
            `"price_list" should equal ${result.request_body.price_list}`
        ).toBe(result.request_body.price_list);
        expect(
            parsedResponse.data.price_list_rate,
            `"price_list_rate" should equal ${result.request_body.price_list_rate}`
        ).toBe(result.request_body.price_list_rate)
        return parsedResponse;
    }

    @Step('Update Supplier for Item')
    static async putUpdateItemSupplier(
        item: Item,
        supplier: Supplier,
        apiManager: ApiManager,
        enableSteps: boolean = true
    ): Promise<Item> {
        const record = {
            supplier_items: [
                {
                    supplier: supplier.supplier_name
                }
            ]
        }
        const result = await apiManager
            .putUpdateRecord(
                `/api/resource/Item/${item.item_code}`,
                item.item_code,
                record,
                enableSteps
            );
        const parsedResponse: ItemResponse = ITEM_RESPONSE_SCHEMA.parse(result.response_body);
        const suppliersNames: string[] = parsedResponse.data.supplier_items.map(record => record.supplier);
        expect(
            suppliersNames,
            `Supplier "${supplier.supplier_name}" should be in the array of suppliers`
        ).toContain(supplier.supplier_name);
        return item;
    }

}