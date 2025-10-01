import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Dto } from './dto';

export class CursorListDto extends Dto{

    private _items: ObjectLiteral[];
    private _cursor: string | null;

    constructor(items: ObjectLiteral[], cursor: string | null ) {
        super();
        this._items = items;
        this._cursor = cursor;
    }

    get cursor(): string | null {
        return this._cursor;
    }

    set cursor(value: string | null) {
        this._cursor = value;
    }
    get items(): ObjectLiteral[] {
        return this._items;
    }

    set items(value: ObjectLiteral[]) {
        this._items = value;
    }
}
