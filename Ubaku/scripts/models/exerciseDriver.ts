module app.models {
    "use strict";

    export interface IExerciseDriver {
        status: ExerciseStatus;
        currentChallenge: IChallenge;
        canSkipCurrentChallenge: boolean;
        canMoveBackward: boolean;
        canMoveForward: boolean;

        start(): void;
        stop(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
        moveBackward(): void;
        moveForward(): void;
    }

    export class ExerciseDriver implements IExerciseDriver {
        private challengeFactory: ChallengeFactory;
        private challengeDriver: ChallengeDriver;
        private exerciseCompleteDriver: ExerciseCompleteDriver;
        private exercise: IExercise = new Exercise();

        public status: ExerciseStatus = new ExerciseStatus();
        public currentChallenge: IChallenge = null;
        public canSkipCurrentChallenge: boolean = true;
        public canMoveBackward: boolean = false;
        public canMoveForward: boolean = false;

        public constructor(private configuration: ExerciseConfiguration, private $interval: ng.IIntervalService) {
            this.challengeFactory = new ChallengeFactory(this.configuration.challengeFactory);
            this.challengeDriver = new ChallengeDriver(this, this.status.challenge, this.configuration.challengeDriver, this.$interval);
            this.exerciseCompleteDriver = new ExerciseCompleteDriver(this, this.configuration.exerciseCompleteDriver);
            this.status.exerciseTotalSteps = this.exerciseCompleteDriver.getTotalSteps();
        }

        public start(): void {
            this.startNewChallenge();
            this.updateUI();
        }

        public stop(): void {
            this.challengeDriver.setChallenge(null);
            this.updateUI();
        }

        public skipCurrentChallenge(): void {
            // A null answer represents skipping the challenge.
            this.respondToCurrentChallenge(null);
        }

        public respondToCurrentChallenge(answer: number) {
            this.challengeDriver.respondToChallenge(answer);
            this.updateUI();
        }

        public onChallengeComplete(shouldStartNewChallenge: boolean): void {
            if (shouldStartNewChallenge) {
                if (this.exerciseCompleteDriver.isComplete()) {
                    this.status.isComplete = true;
                    this.status.challengeNumber = null;
                } else {
                    this.startNewChallenge();
                }
            }
            this.updateUI();
        }

        public moveBackward(): void {
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            if (currentChallengeIndex > 0) {
                // Move backward in the list.
                this.setCurrentChallenge(this.exercise.challenges[currentChallengeIndex - 1]);
            }
            this.updateUI();
        }

        public moveForward(): void {
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            if (currentChallengeIndex < this.exercise.challenges.length - 1) {
                // Move forward in the list.
                this.setCurrentChallenge(this.exercise.challenges[currentChallengeIndex + 1]);
            } else if (this.canMoveForwardPastEnd()) {
                // We're at the last challenge and it's complete, so moving to the next actually means starting a new challenge.
                this.onChallengeComplete(true);
            }
            this.updateUI();
        }

        private startNewChallenge(): void {
            // Attempt to generate a challenge different from the last one.
            var newChallenge = this.currentChallenge;
            const MaxAttempts: number = 10;
            var attempt = 0;
            while ((attempt++ < MaxAttempts) && (newChallenge === null || newChallenge.equals(this.currentChallenge))) {
                newChallenge = this.challengeFactory.createChallenge();
            }

            // Start the new challenge.
            this.exercise.challenges.push(newChallenge);
            this.setCurrentChallenge(newChallenge);
        }

        private setCurrentChallenge(challenge: app.models.IChallenge) {
            this.currentChallenge = challenge;
            this.challengeDriver.setChallenge(this.currentChallenge);
            this.status.challengeNumber = (this.currentChallenge === null ? null : this.exercise.challenges.indexOf(this.currentChallenge) + 1);
        }

        private updateUI(): void {
            this.status.challengesRespondedCount = this.getChallengesRespondedCount();
            this.status.challengesSolvedCount = this.getChallengesSolvedCount();
            this.status.challengesSolvedPercentage = this.status.challengesRespondedCount > 0 ? this.status.challengesSolvedCount / this.status.challengesRespondedCount : null;
            this.status.challengesCompletedCount = this.getChallengesCompletedCount();
            this.status.exerciseCurrentStep = this.exerciseCompleteDriver.getCurrentStep();
            this.status.exerciseCompletePercentage = this.status.exerciseTotalSteps > 0 ? this.status.exerciseCurrentStep / this.status.exerciseTotalSteps : null;
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            this.canSkipCurrentChallenge = this.challengeDriver.canSkip();
            this.canMoveBackward = this.challengeDriver.canMoveBackward() && (currentChallengeIndex > 0);
            this.canMoveForward = this.challengeDriver.canMoveForward() && ((currentChallengeIndex < this.exercise.challenges.length - 1) || this.canMoveForwardPastEnd());
        }

        private canMoveForwardPastEnd(): boolean {
            // If the exercise is not complete, allow moving forward if at the last challenge and it's complete.
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            return currentChallengeIndex === this.exercise.challenges.length - 1 && this.currentChallenge.isComplete && !this.exerciseCompleteDriver.isComplete();
        }

        public getChallengesRespondedCount(): number {
            return this.reduceChallenges((challenge) => challenge.responses.length);
        }

        public getChallengesCompletedCount(): number {
            return this.reduceChallenges((challenge) => challenge.isComplete ? 1 : 0);
        }

        public getChallengesSolvedCount(): number {
            return this.reduceChallenges((challenge) => challenge.isSolved ? 1 : 0);
        }

        private reduceChallenges(fn: (challenge: IChallenge) => number): number {
            if (this.exercise.challenges.length === 0) {
                return 0;
            }
            return this.exercise.challenges.reduce((previousValue: number, currentValue: IChallenge, currentIndex: number, array: IChallenge[]) => previousValue + fn(currentValue), 0);
        }
    }
}