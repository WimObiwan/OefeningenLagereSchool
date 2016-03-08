module app.models {
    "use strict";

    export interface IExerciseDriver {
        status: ExerciseStatus;
        currentChallenge: IChallenge;

        start(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    export class ExerciseDriver implements IExerciseDriver {
        private challengeFactory: ChallengeFactory;
        private challengeCompleteDriver: ChallengeCompleteDriver;
        private exerciseCompleteDriver: ExerciseCompleteDriver;
        private exercise: IExercise = new Exercise();

        public status: ExerciseStatus = new ExerciseStatus();
        public currentChallenge: IChallenge = null;

        public constructor(private configuration: ExerciseConfiguration) {
            this.challengeFactory = new ChallengeFactory(this.configuration.challengeFactory);
            this.challengeCompleteDriver = new ChallengeCompleteDriver(this.configuration.challengeCompleteDriver);
            this.exerciseCompleteDriver = new ExerciseCompleteDriver(this.configuration.exerciseCompleteDriver);
            this.status.exerciseTotalSteps = this.exerciseCompleteDriver.getTotalSteps();
        }

        public start() {
            this.startNewChallenge();
        }

        public respondToCurrentChallenge(answer: number) {
            var challenge = this.currentChallenge;
            var responseStatus = challenge.addResponse(answer);
            this.status.lastResponseStatus = responseStatus;
            this.status.challengesRespondedCount += 1;
            this.status.challengesSolvedCount += (responseStatus.response.isSolution ? 1 : 0);
            this.status.challengesSolvedPercentage = this.status.challengesSolvedCount / this.status.challengesRespondedCount;

            if (answer === null || this.challengeCompleteDriver.isComplete(challenge)) {
                this.status.challengesCompletedCount += 1;
                if (this.exerciseCompleteDriver.isComplete(this.exercise, this.status)) {
                    this.currentChallenge = null;
                    this.status.isComplete = true;
                    this.status.challengeNumber = null;
                } else {
                    this.startNewChallenge();
                }
            }

            this.updateExerciseStatus();
        }

        public skipCurrentChallenge(): void {
            this.respondToCurrentChallenge(null);
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
            this.currentChallenge = newChallenge;
            this.status.challengeNumber = this.exercise.challenges.indexOf(this.currentChallenge) + 1;
            this.updateExerciseStatus();
        }

        private updateExerciseStatus(): void {
            this.status.exerciseCurrentStep = this.exerciseCompleteDriver.getCurrentStep(this.status);
            this.status.exerciseCompletePercentage = this.status.exerciseCurrentStep / this.status.exerciseTotalSteps;
        }
    }
}