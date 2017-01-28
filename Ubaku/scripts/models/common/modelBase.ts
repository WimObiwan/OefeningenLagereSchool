module app.models {
    "use strict";

    export interface IModelBase {
        createdTime: Date;
    }

    export abstract class ModelBase implements IModelBase {
        createdTime: Date;

        constructor() {
            this.createdTime = new Date();
        }
    }
}