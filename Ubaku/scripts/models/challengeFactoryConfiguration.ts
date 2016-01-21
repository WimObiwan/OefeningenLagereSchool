module app.models {
    "use strict";

    export class ChallengeFactoryConfiguration {
        public type: ChallengeFactoryType;
        public options: any; // TODO-L: Use actual classes instead of any (also in other places)

        public constructor() {
            this.options = [];
        }
    }
}