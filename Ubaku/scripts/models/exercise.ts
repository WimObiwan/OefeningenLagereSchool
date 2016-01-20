module app.models {
    "use strict";

    export interface IExercise extends IModelBase {
        challenges: IChallenge[]
    }

    export class Exercise extends ModelBase implements IExercise {
        public challenges: IChallenge[] = [];

        constructor() {
            super();
        }
    }
}