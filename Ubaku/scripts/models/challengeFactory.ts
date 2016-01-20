module app.models {
    "use strict";

    export class ChallengeFactory {
        public constructor(private configuration: ChallengeFactoryConfiguration) {
        }

        public createChallenge(): app.models.IChallenge {

            var type = this.configuration.type || ChallengeFactoryConfiguration.TypeSplittingNumbers;
            if (type === ChallengeFactoryConfiguration.TypeSplittingNumbers) {
                var minNumber = this.configuration.options.minNumberToSplit || 0;
                var maxNumber = this.configuration.options.maxNumberToSplit || 10;

                var numberToSplit = this.getRandomInt(minNumber, maxNumber);
                var splitComponent = this.getRandomInt(0, numberToSplit);
                var solution = numberToSplit - splitComponent;
                var availableAnswers: number[] = [];
                availableAnswers.length = maxNumber + 1;
                for (var i = 0; i < availableAnswers.length; i++) {
                    availableAnswers[i] = i;
                }
                return new app.models.Challenge(numberToSplit, splitComponent, availableAnswers, solution);
            } else {
                throw new Error("Unknown challenge type: " + type);
            }
        }

        private getRandomInt(minInclusive: number, maxInclusive: number): number {
            return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
        }
    }
}