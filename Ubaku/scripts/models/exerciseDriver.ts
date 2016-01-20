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
        private exercise: IExercise = new Exercise();

        public status: ExerciseStatus = new ExerciseStatus();
        public currentChallenge: IChallenge = null;

        public constructor(private configuration: ExerciseConfiguration) {
            this.challengeFactory = new ChallengeFactory(this.configuration.challengeFactory);
            this.challengeEndDriver = new ChallengeEndDriver(this.configuration.challengeEndDriver);
        }

        public start() {
            this.startNewChallenge();
        }

        public respond(answer: number): ResponseStatus {
            var challenge = this.currentChallenge;
            var responseStatus = challenge.addResponse(answer);
            this.status.lastResponseStatus = responseStatus;
            if (this.challengeEndDriver.shouldEnd(challenge)) {
                this.startNewChallenge();
            }
            return responseStatus;
        }

        private startNewChallenge(): void {
            var challenge = this.challengeFactory.createChallenge();
            this.exercise.challenges.push(challenge);
            this.currentChallenge = challenge;
            this.status.challengeNumber = this.exercise.challenges.indexOf(this.currentChallenge) + 1;
        }
    }
}