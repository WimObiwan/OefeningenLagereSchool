module app.models {
    'use strict';

    export interface IResponse extends IModelBase {
        answer: number;
        isSolution: boolean;
    }

    export class Response extends ModelBase implements IResponse {
        constructor(public answer: number, public isSolution: boolean) {
            super();
        }
    }
}