module app.models {
    "use strict";

    export class ChallengeEndDriver {
        private type: ChallengeEndDriverType = null;

        constructor(private configuration: ChallengeEndDriverConfiguration) {
            this.type = this.configuration.type || Defaults.ChallengeEndDriverType;
        }

        public shouldEnd(lastChallenge: IChallenge): boolean {
            if (this.type === ChallengeEndDriverType.Solved) {
                return lastChallenge.isSolved;
            } else if (this.type === ChallengeEndDriverType.Answered) {
                return true;
            } else if (this.type === ChallengeEndDriverType.Manual) {
                return false;
            } else {
                throw new Error("Unknown challenge end driver type: " + this.type);
            }
        }
    }
}