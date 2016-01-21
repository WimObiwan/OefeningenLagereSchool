module app.models {
    "use strict";

    export class ChallengeEndDriver {
        private type: string = null;

        constructor(private configuration: ChallengeEndDriverConfiguration) {
            this.type = this.configuration.type || ChallengeEndDriverConfiguration.TypeSolved;
        }

        public shouldEnd(lastChallenge: IChallenge): boolean {
            if (this.type === ChallengeEndDriverConfiguration.TypeSolved) {
                return lastChallenge.isSolved;
            }
            else if (this.type === ChallengeEndDriverConfiguration.TypeAnswered) {
                return true;
            }
            else if (this.type === ChallengeEndDriverConfiguration.TypeManual) {
                return false;
            }
            else {
                throw new Error("Unknown challenge end driver type: " + this.type);
            }
        }
    }
}