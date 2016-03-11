module app.models {
    "use strict";

    export class ChallengeDriver {
        private challengeCompleteType: ChallengeCompleteType;
        private challengeEndType: ChallengeEndType;
        private challengeCompleteTimeMilliseconds: number;
        private challenge: IChallenge = null;
        private challengeStartTime: Date = null;
        private timerPromise: ng.IPromise<void> = null;

        constructor(private exerciseDriver: ExerciseDriver, private status: ChallengeStatus, configuration: ChallengeDriverConfiguration, private $interval: ng.IIntervalService) {
            // Determine the configuration parameters.
            this.challengeCompleteType = configuration.challengeCompleteType || Defaults.ChallengeCompleteType;
            this.challengeEndType = configuration.challengeEndType || Defaults.ChallengeEndType;
            this.challengeCompleteTimeMilliseconds = 1000 * (configuration.challengeCompleteTimeSeconds || Defaults.ChallengeCompleteTimeSeconds);
        }

        public setChallenge(challenge: IChallenge) {
            this.stopTimer();
            this.challenge = challenge;
            if (this.challenge !== null && this.challenge.responses.length > 0) {
                this.status.lastResponseStatus = this.challenge.getResponseStatus(this.challenge.getLastResponse());
            }
            if (this.challenge !== null && !this.challenge.isComplete && this.challengeCompleteType === ChallengeCompleteType.Time) {
                this.startTimer();
            }
        }

        public respondToChallenge(answer: number): void {
            this.status.lastResponseStatus = this.challenge.addResponse(answer);
            this.checkChallengeComplete();
        }

        public canSkip(): boolean {
            if (this.challenge === null) {
                return false;
            } else if (this.challengeCompleteType === ChallengeCompleteType.Solved) {
                return false;
            } else {
                return !this.challenge.isComplete;
            }
        }

        public canMoveBackward(): boolean {
            return this.canMoveForward();
        }

        public canMoveForward(): boolean {
            if (this.challengeCompleteType === ChallengeCompleteType.Time) {
                return this.challenge === null || this.challenge.isComplete;
            } else {
                return true;
            }
        }

        private startTimer(): void {
            this.challengeStartTime = new Date();
            this.timerPromise = this.$interval(() => this.onTimerElapsed(), 500);
            this.onTimerElapsed();
        }

        private stopTimer(): void {
            this.status.timeRemainingMilliseconds = null;
            this.status.timeRemainingPercentage = null;
            if (this.timerPromise !== null) {
                this.$interval.cancel(this.timerPromise);
                this.timerPromise = null;
            }
        }

        private onTimerElapsed(): void {
            var challengeTimeRemainingMilliseconds = this.getChallengeTimeRemainingMilliseconds();
            this.status.timeRemainingMilliseconds = challengeTimeRemainingMilliseconds;
            this.status.timeRemainingPercentage = challengeTimeRemainingMilliseconds / this.challengeCompleteTimeMilliseconds;
            if (challengeTimeRemainingMilliseconds <= 0) {
                if (this.challenge.responses.length === 0) {
                    this.respondToChallenge(null);
                } else {
                    this.checkChallengeComplete();
                }
            }
        }

        private getChallengeTimeRemainingMilliseconds(): number {
            return Math.max(0, (this.challengeStartTime.getTime() + this.challengeCompleteTimeMilliseconds) - new Date().getTime());
        }

        private checkChallengeComplete(): void {
            this.challenge.isComplete = this.isComplete();
            if (this.challenge.isComplete) {
                this.stopTimer();
                var shouldStartNewChallenge = this.shouldStartNewChallenge();
                this.exerciseDriver.onChallengeComplete(shouldStartNewChallenge);
            }
        }

        private isComplete(): boolean {
            if (this.challengeCompleteType === ChallengeCompleteType.Solved) {
                return this.challenge.isSolved;
            } else if (this.challengeCompleteType === ChallengeCompleteType.Responded) {
                return this.challenge.responses.length > 0;
            } else if (this.challengeCompleteType === ChallengeCompleteType.Time) {
                return this.challenge.responses.length > 0 || this.getChallengeTimeRemainingMilliseconds() <= 0;
            } else {
                throw new Error("Unknown challenge complete type: " + this.challengeCompleteType);
            }
        }

        private shouldStartNewChallenge(): boolean {
            if (this.challengeEndType === ChallengeEndType.Manual) {
                return false;
            } else if (this.challengeEndType === ChallengeEndType.ChallengeComplete) {
                return this.challenge.isComplete;
            } else {
                throw new Error("Unknown challenge end type: " + this.challengeCompleteType);
            }
        }
    }
}