module app.models {
    "use strict";

    export class ChallengeDriver {
        private completeType: ChallengeCompleteType;
        private completeAfterMilliseconds: number;
        private challenge: IChallenge = null;
        private challengeStartTime: Date = null;
        private timerPromise: ng.IPromise<void> = null;

        constructor(private exerciseDriver: ExerciseDriver, private status: ChallengeStatus, configuration: ChallengeDriverConfiguration, private $interval: ng.IIntervalService) {
            // Determine the configuration parameters.
            this.completeType = configuration.completeType || Defaults.ChallengeCompleteType;
            this.completeAfterMilliseconds = 1000 * (configuration.completeAfterSeconds || Defaults.ChallengeCompleteAfterSeconds);
        }

        public setChallenge(challenge: IChallenge) {
            this.stopTimer();
            this.challenge = challenge;
            if (this.challenge !== null && this.challenge.responseCount > 0) {
                this.status.lastResponseStatus = this.challenge.getResponseStatus(this.challenge.getLastResponse());
            }
            if (this.challenge !== null && !this.challenge.isComplete && this.completeType === ChallengeCompleteType.Time) {
                this.startTimer();
            }
        }

        public respondToChallenge(answer: number): void {
            this.status.lastResponseStatus = this.challenge.addResponse(answer);
            this.challenge.isComplete = this.isComplete();
            if (this.challenge.isComplete) {
                this.onChallengeComplete();
            }
        }

        public canSkip(): boolean {
            if (this.challenge === null) {
                return false;
            } else if (this.completeType === ChallengeCompleteType.Solved) {
                return false;
            } else {
                return !this.challenge.isComplete;
            }
        }

        public stop(): void {
            this.stopTimer();
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
            this.status.timeRemainingPercentage = challengeTimeRemainingMilliseconds / this.completeAfterMilliseconds;
            if (challengeTimeRemainingMilliseconds <= 0) {
                this.challenge.forceComplete();
                this.onChallengeComplete();
                this.status.lastResponseStatus = this.challenge.addResponse(null);
            }
        }

        private getChallengeTimeRemainingMilliseconds(): number {
            return Math.max(0, (this.challengeStartTime.getTime() + this.completeAfterMilliseconds) - new Date().getTime());
        }

        private onChallengeComplete(): void {
            this.stopTimer();
            var shouldStartNewChallenge = this.shouldStartNewChallenge();
            this.exerciseDriver.onChallengeComplete(shouldStartNewChallenge);
        }

        private isComplete(): boolean {
            if (this.completeType === ChallengeCompleteType.Solved) {
                return this.challenge.isSolved;
            } else if (this.completeType === ChallengeCompleteType.Responded) {
                return this.challenge.responseCount > 0;
            } else if (this.completeType === ChallengeCompleteType.Time) {
                return this.challenge.responseCount > 0 || this.getChallengeTimeRemainingMilliseconds() <= 0;
            } else {
                throw new Error("Unknown challenge complete type: " + this.completeType);
            }
        }

        private shouldStartNewChallenge(): boolean {
            return this.challenge.isComplete;
        }
    }
}