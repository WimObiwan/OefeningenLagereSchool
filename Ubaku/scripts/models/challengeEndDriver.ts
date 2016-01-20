module app.models {
    "use strict";

    export class ChallengeEndDriver {
        constructor(private configuration: ChallengeEndDriverConfiguration) {
        }

        public shouldEnd(lastChallenge: IChallenge): boolean {
            var challengeEndDriverType = this.configuration.type || ChallengeEndDriverConfiguration.TypeSolved;
            if (challengeEndDriverType === ChallengeEndDriverConfiguration.TypeSolved) {
                return lastChallenge.isSolved;
            }
            else if (challengeEndDriverType === ChallengeEndDriverConfiguration.TypeAnswered) {
                return true;
            }
            else if (challengeEndDriverType === ChallengeEndDriverConfiguration.TypeManual) {
                return false;
            }
            else {
                throw new Error("Unknown challenge end driver type: " + challengeEndDriverType);
            }
        }
    }
}