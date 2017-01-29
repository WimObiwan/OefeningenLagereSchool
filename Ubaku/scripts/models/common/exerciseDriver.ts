module app.models {
    "use strict";

    export interface IExerciseDriver {
        status: ExerciseStatus;
        currentChallenge: IChallenge;
        canSkipCurrentChallenge: boolean;

        start(): void;
        stop(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    export class ExerciseDriver implements IExerciseDriver {
        private challengeFactory: IChallengeFactory;
        private challengeDriver: ChallengeDriver;
        private exerciseCompleteDriver: ExerciseCompleteDriver;
        private exercise: IExercise = new Exercise();

        public status: ExerciseStatus = new ExerciseStatus();
        public currentChallenge: IChallenge = null;
        public canSkipCurrentChallenge: boolean = true;

        public constructor(private challengeFactory_: IChallengeFactory, private configuration: ExerciseConfiguration, private $interval: ng.IIntervalService) {
            this.challengeFactory = challengeFactory_;
            this.challengeDriver = new ChallengeDriver(this, this.status.challenge, this.configuration.challengeDriver, this.$interval);
            this.exerciseCompleteDriver = new ExerciseCompleteDriver(this, this.configuration.exerciseCompleteDriver, this.$interval);
            this.status.exerciseTotalSteps = this.exerciseCompleteDriver.getTotalSteps();
        }

        public start(): void {
            this.exerciseCompleteDriver.stop();
            this.exerciseCompleteDriver.start();
            this.startNewChallenge();
            this.updateUI();
        }

        public stop(): void {
            this.challengeDriver.setChallenge(null);
            this.exerciseCompleteDriver.stop();
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

        public onExerciseComplete(excludeLastChallenge: Boolean): void {
            this.endExercise(excludeLastChallenge);
            this.updateUI();
        }

        public onChallengeComplete(shouldStartNewChallenge: boolean): void {
            if (shouldStartNewChallenge) {
                if (this.exerciseCompleteDriver.isComplete()) {
                    this.endExercise(false);
                } else {
                    this.startNewChallenge();
                }
            }
            this.updateUI();
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

        private endExercise(excludeLastChallenge: Boolean): void {
            this.challengeDriver.stop();
            if (!excludeLastChallenge)
                this.currentChallenge.forceComplete();
            this.status.isComplete = true;
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
        }

        private reduceChallenges(fn: (challenge: IChallenge) => number): number {
            if (this.exercise.challenges.length === 0) {
                return 0;
            }
            return this.exercise.challenges.reduce((previousValue: number, currentValue: IChallenge, currentIndex: number, array: IChallenge[]) => previousValue + fn(currentValue), 0);
        }
    }
}