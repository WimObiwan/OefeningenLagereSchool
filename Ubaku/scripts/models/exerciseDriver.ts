module app.models {
    "use strict";

    export interface IExerciseDriver {
        status: ExerciseStatus;
        currentChallenge: IChallenge;
        canSkipCurrentChallenge: boolean;
        canMoveBackward: boolean;
        canMoveForward: boolean;

        start(): void;
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

        public constructor(private configuration: ExerciseConfiguration) {
            this.challengeFactory = new ChallengeFactory(this.configuration.challengeFactory);
            this.challengeDriver = new ChallengeDriver(this.configuration.challengeDriver);
            this.exerciseCompleteDriver = new ExerciseCompleteDriver(this.configuration.exerciseCompleteDriver);
            this.status.exerciseTotalSteps = this.exerciseCompleteDriver.getTotalSteps();
        }

        public start() {
            this.startNewChallenge();
        }

        public respondToCurrentChallenge(answer: number) {
            // A null answer represents skipping the challenge.
            var challenge = this.currentChallenge;
            var responseStatus = challenge.addResponse(answer);
            challenge.isComplete = this.challengeDriver.isComplete(challenge);
            this.status.lastResponseStatus = responseStatus;
            this.status.challengesRespondedCount += 1;
            this.status.challengesSolvedCount += (responseStatus.response.isSolution ? 1 : 0);
            this.status.challengesSolvedPercentage = this.status.challengesSolvedCount / this.status.challengesRespondedCount;

            if (challenge.isComplete) {
                this.status.challengesCompletedCount += 1;
                if (this.exerciseCompleteDriver.isComplete(this.exercise, this.status)) {
                    this.currentChallenge = null;
                    this.status.isComplete = true;
                    this.status.challengeNumber = null;
                } else {
                    if (this.challengeDriver.shouldStartNewChallenge(challenge)) {
                        this.startNewChallenge();
                    }
                }
            }

            this.updateExerciseStatus();
        }

        public skipCurrentChallenge(): void {
            // A null answer represents skipping the challenge.
            this.respondToCurrentChallenge(null);
        }

        public moveBackward(): void {
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            if (currentChallengeIndex > 0) {
                // Move backward in the list.
                this.setCurrentChallenge(this.exercise.challenges[currentChallengeIndex - 1]);
            }
        }

        public moveForward(): void {
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            if (currentChallengeIndex < this.exercise.challenges.length - 1) {
                // Move forward in the list.
                this.setCurrentChallenge(this.exercise.challenges[currentChallengeIndex + 1]);
            } else if (currentChallengeIndex === this.exercise.challenges.length - 1 && this.currentChallenge.isComplete) {
                // We're at the last challenge and it's complete, so moving to the next actually means starting a new challenge.
                this.startNewChallenge();
            }
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
            this.status.challengeNumber = this.exercise.challenges.indexOf(this.currentChallenge) + 1;
            this.updateExerciseStatus();
        }

        private updateExerciseStatus(): void {
            this.status.exerciseCurrentStep = this.exerciseCompleteDriver.getCurrentStep(this.status);
            this.status.exerciseCompletePercentage = this.status.exerciseCurrentStep / this.status.exerciseTotalSteps;
            var currentChallengeIndex = this.exercise.challenges.indexOf(this.currentChallenge);
            this.canSkipCurrentChallenge = this.challengeDriver.canSkip(this.currentChallenge);
            this.canMoveBackward = currentChallengeIndex > 0;
            this.canMoveForward = (currentChallengeIndex < this.exercise.challenges.length - 1) || (currentChallengeIndex === this.exercise.challenges.length - 1 && this.currentChallenge.isComplete);
        }
    }
}