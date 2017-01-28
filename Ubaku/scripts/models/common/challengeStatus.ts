module app.models {
    "use strict";

    export class ChallengeStatus {
        public timeRemainingMilliseconds: number = null;
        public timeRemainingPercentage: number = null;
        public lastResponseStatus: ResponseStatus = null;
    }
}