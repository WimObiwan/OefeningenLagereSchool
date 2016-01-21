module app.models {
    "use strict";

    export interface IExerciseDriver {
        status: ExerciseStatus;
        currentChallenge: IChallenge;

        start(): void;
        respond(answer: number): void;
    }

    export class ExerciseDriver implements IExerciseDriver {
        private challengeFactory: ChallengeFactory;
        private challengeEndDriver: ChallengeEndDriver;
        private exerciseEndDriver: ExerciseEndDriver;
        private exercise: IExercise = new Exercise();

        public status: ExerciseStatus = new ExerciseStatus();
        public currentChallenge: IChallenge = null;

        public constructor(private configuration: ExerciseConfiguration) {
            this.challengeFactory = new ChallengeFactory(this.configuration.challengeFactory);
            this.challengeEndDriver = new ChallengeEndDriver(this.configuration.challengeEndDriver);
            this.exerciseEndDriver = new ExerciseEndDriver(this.configuration.exerciseEndDriver);
        }

        public start() {
            this.startNewChallenge();
        }

        public respond(answer: number): ResponseStatus {
            var challenge = this.currentChallenge;
            var responseStatus = challenge.addResponse(answer);
            this.status.lastResponseStatus = responseStatus;

            if (this.challengeEndDriver.shouldEnd(challenge)) {
                this.status.challengesCompletedCount += 1;
                this.status.challengesSolvedCount += (responseStatus.response.isSolution ? 1 : 0);
                this.status.challengesSolvedPercentage = this.status.challengesSolvedCount / this.status.challengesCompletedCount;
                if (this.exerciseEndDriver.shouldEnd(this.exercise, this.status)) {
                    this.currentChallenge = null;
                    this.status.isComplete = true;
                    this.status.challengeNumber = null;
                }
                else {
                    this.startNewChallenge();
                }
            }

            return responseStatus;
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
        }
    }
}