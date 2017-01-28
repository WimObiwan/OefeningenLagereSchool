module app.models {
    "use strict";

    export interface IChallengeFactory {
        createChallenge(): IChallenge
    }
}