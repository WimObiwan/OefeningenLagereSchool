module app.models {
    "use strict";

    export class ChallengeCompleteDriver {
        private type: ChallengeCompleteDriverType = null;

        constructor(private configuration: ChallengeCompleteDriverConfiguration) {
            // Determine the configuration parameters.
            this.type = this.configuration.type || Defaults.ChallengeCompleteDriverType;
        }

        public isComplete(lastChallenge: IChallenge): boolean {
            if (this.type === ChallengeCompleteDriverType.Solved) {
                return lastChallenge.isSolved;
            } else if (this.type === ChallengeCompleteDriverType.Responded) {
                return true;
            } else if (this.type === ChallengeCompleteDriverType.Manual) {
                return false;
            } else {
                throw new Error("Unknown challenge complete driver type: " + this.type);
            }
        }
    }
}