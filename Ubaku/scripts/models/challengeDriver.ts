module app.models {
    "use strict";

    export class ChallengeDriver {
        private challengeCompleteType: ChallengeCompleteType = null;
        private challengeEndType: ChallengeEndType = null;

        constructor(private configuration: ChallengeDriverConfiguration) {
            // Determine the configuration parameters.
            this.challengeCompleteType = this.configuration.challengeCompleteType || Defaults.ChallengeCompleteType;
            this.challengeEndType = this.configuration.challengeEndType || Defaults.ChallengeEndType;
        }

        public isComplete(challenge: IChallenge): boolean {
            if (this.challengeCompleteType === ChallengeCompleteType.Solved) {
                return challenge.isSolved;
            } else if (this.challengeCompleteType === ChallengeCompleteType.Responded) {
                return challenge.responses.length > 0;
            } else {
                throw new Error("Unknown challenge complete type: " + this.challengeCompleteType);
            }
        }

        public shouldStartNewChallenge(challenge: IChallenge): boolean {
            if (this.challengeEndType === ChallengeEndType.Manual) {
                return false;
            } else if (this.challengeEndType === ChallengeEndType.ChallengeComplete) {
                return challenge.isComplete;
            } else {
                throw new Error("Unknown challenge end type: " + this.challengeCompleteType);
            }
        }

        public canSkip(challenge: IChallenge): boolean {
            if (this.challengeCompleteType === ChallengeCompleteType.Solved) {
                return false;
            } else {
                return !challenge.isComplete;
            }
        }
    }
}