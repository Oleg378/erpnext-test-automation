import {DocStatesEnum} from '../../enums/DocStatesEnum';
import {DocTypesEnum} from '../../enums/DocTypesEnum';

export interface ErpDocument {
    name: string;
    status:  DocStatesEnum;
    doctype: DocTypesEnum;
}