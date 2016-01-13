module app.models {
    'use strict';

    export interface IExercise extends IModelBase {
        challenges: IChallenge[]
        getPreviousChallenge(): IChallenge;
    }

    export class Exercise extends ModelBase implements IExercise {
        public challenges: IChallenge[];

        constructor() {
            super();
            this.challenges = [];
        }

        getPreviousChallenge() {
            if (this.challenges.length <= 1) {
                return null;
            } else {
                return this.challenges[this.challenges.length - 2];
            }
        }
    }
}