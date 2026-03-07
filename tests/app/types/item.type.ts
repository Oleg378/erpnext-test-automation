import {ItemGroupEnum} from '../../enums/ItemGroupEnum';
import {UOMEnum} from '../../enums/UOMEnum';

export interface Item {
    item_code: string, // uid
    item_name: string,
    item_group: ItemGroupEnum,
    stock_uom: UOMEnum,
    is_stock_item: number,
    is_purchase_item: number
}