module app.models {
    "use strict";

    export class ExerciseCompleteDriver {
        private type: ExerciseCompleteDriverType = null;
        private completeAfterChallengesCompleted: number = null;
        private completeAfterChallengesSolved: number = null;
        private completeAfterMilliseconds: number = null;
        private exerciseStartTime: Date = null;
        private timerPromise: ng.IPromise<void> = null;

        public constructor(private exerciseDriver: ExerciseDriver, configuration: ExerciseCompleteDriverConfiguration, private $interval: ng.IIntervalService) {
            // Determine the configuration parameters.
            this.type = configuration.type || Defaults.ExerciseCompleteDriverType;
            this.completeAfterChallengesCompleted = configuration.completeAfterChallengesCompleted || Defaults.ExerciseCompleteAfterChallengesCompleted;
            this.completeAfterChallengesSolved = configuration.completeAfterChallengesSolved || Defaults.ExerciseCompleteAfterChallengesSolved;
            this.completeAfterMilliseconds = 1000 * (configuration.completeAfterSeconds || Defaults.ExerciseCompleteAfterSeconds);
        }

        public start(): void {
            if (this.type === ExerciseCompleteDriverType.Time) {
                this.startTimer();
            }
        }

        public stop(): void {
            this.stopTimer();
        }

        public isComplete(): boolean {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return false;
            } else if (this.type === ExerciseCompleteDriverType.Time) {
                return this.getExerciseTimeRemainingMilliseconds() <= 0;
            } else {
                var totalSteps = this.getTotalSteps();
                var currentStep = this.getCurrentStep();
                return totalSteps !== null && totalSteps === currentStep;
            }
        }

        public getTotalSteps(): number {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesCompleted) {
                return this.completeAfterChallengesCompleted;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesSolved) {
                return this.completeAfterChallengesSolved;
            } else if (this.type === ExerciseCompleteDriverType.Time) {
                return null;
            } else {
                throw new Error("Unknown exercise complete driver type: " + this.type);
            }
        }

        public getCurrentStep(): number {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesCompleted) {
                return this.exerciseDriver.getChallengesCompletedCount();
            } else if (this.type === ExerciseCompleteDriverType.ChallengesSolved) {
                return this.exerciseDriver.getChallengesSolvedCount();
            } else if (this.type === ExerciseCompleteDriverType.Time) {
                return null;
            } else {
                throw new Error("Unknown exercise complete driver type: " + this.type);
            }
        }

        private startTimer(): void {
            this.exerciseStartTime = new Date();
            this.timerPromise = this.$interval(() => this.onTimerElapsed(), 500);
            this.onTimerElapsed();
        }

        private stopTimer(): void {
            this.exerciseDriver.status.timeRemainingMilliseconds = null;
            this.exerciseDriver.status.timeRemainingPercentage = null;
            if (this.timerPromise !== null) {
                this.$interval.cancel(this.timerPromise);
                this.timerPromise = null;
            }
        }

        private onTimerElapsed(): void {
            var exerciseTimeRemainingMilliseconds = this.getExerciseTimeRemainingMilliseconds();
            this.exerciseDriver.status.timeRemainingMilliseconds = exerciseTimeRemainingMilliseconds;
            this.exerciseDriver.status.timeRemainingPercentage = exerciseTimeRemainingMilliseconds / this.completeAfterMilliseconds;
            if (exerciseTimeRemainingMilliseconds <= 0) {
                this.stopTimer();
                this.exerciseDriver.onExerciseComplete();
            }
        }

        private getExerciseTimeRemainingMilliseconds(): number {
            return Math.max(0, (this.exerciseStartTime.getTime() + this.completeAfterMilliseconds) - new Date().getTime());
        }
    }
}