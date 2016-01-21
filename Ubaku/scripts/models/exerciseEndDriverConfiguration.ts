module app.models {
    "use strict";

    export class ExerciseEndDriverConfiguration {
        public type: ExerciseEndDriverType;
        public options: any;

        public constructor() {
            this.options = [];
        }
    }
}