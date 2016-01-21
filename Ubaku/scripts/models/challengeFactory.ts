module app.models {
    "use strict";

    export class ChallengeFactory {
        private type: string = null;
        private numberToSplitSequence: string = null;
        private splitComponentSequence: string = null;
        private minNumberToSplit: number = null;
        private maxNumberToSplit: number = null;
        private availableAnswers: number[] = [];
        private numbersToSplitQueue: number[] = [];
        private splitComponentsQueue: number[] = [];

        public constructor(private configuration: ChallengeFactoryConfiguration) {
            // Determine the configuration parameters.
            this.type = this.configuration.type || ChallengeFactoryConfiguration.TypeSplittingNumbers;
            this.numberToSplitSequence = this.configuration.options.numberToSplitSequence || ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceRandom;
            if (this.numberToSplitSequence === ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceRandom) {
                // If the number to split is random, so must be the split component.
                this.splitComponentSequence = ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceRandom;
            } else {
                this.splitComponentSequence = this.configuration.options.splitComponentSequence || ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceRandom;
            }
            this.minNumberToSplit = this.configuration.options.minNumberToSplit || 0;
            this.maxNumberToSplit = this.configuration.options.maxNumberToSplit || 10;

            // Generate the array of available answers.
            this.availableAnswers = ChallengeFactory.createArray(0, this.maxNumberToSplit, ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceUp);
        }

        private static createArray(min: number, max: number, sequence: string): number[] {
            var values = new Array<number>(1 + max - min);
            for (var i = 0; i < values.length; i++) {
                values[i] = min + i;
            }
            if (sequence === ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceUp) {
                // Do nothing extra.
            } else if (sequence === ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceRandom) {
                ChallengeFactory.shuffle(values);
            } else if (sequence === ChallengeFactoryConfiguration.TypeSplittingNumbersSequenceDown) {
                values = values.reverse();
            } else {
                throw new Error("Unknown sequence type: " + sequence);
            }
            return values;
        }

        private static shuffle<T>(o: T[]) {
            for (var j: number, x: T, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        public createChallenge(): app.models.IChallenge {
            if (this.type === ChallengeFactoryConfiguration.TypeSplittingNumbers) {
                if (this.numbersToSplitQueue.length === 0) {
                    // There are no more numbers to split in the current batch, generate a new queue.
                    this.numbersToSplitQueue = ChallengeFactory.createArray(this.minNumberToSplit, this.maxNumberToSplit, this.numberToSplitSequence);
                }
                var numberToSplit = this.numbersToSplitQueue[0];

                if (this.splitComponentsQueue.length === 0) {
                    // There are no more split components in the current batch, generate a new queue.
                    this.splitComponentsQueue = ChallengeFactory.createArray(0, numberToSplit, this.splitComponentSequence);
                }
                var splitComponent = this.splitComponentsQueue[0];

                // Take a split component from the queue.
                this.splitComponentsQueue = this.splitComponentsQueue.splice(1);
                if (this.splitComponentsQueue.length === 0) {
                    // If the last split component was taken, move to the next number to split in the queue.
                    this.numbersToSplitQueue = this.numbersToSplitQueue.splice(1);
                }

                // Determine the solution and create the challenge.
                var solution = numberToSplit - splitComponent;
                return new app.models.Challenge(numberToSplit, splitComponent, this.availableAnswers, solution);
            } else {
                throw new Error("Unknown challenge type: " + this.type);
            }
        }

        private getRandomInt(minInclusive: number, maxInclusive: number): number {
            return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
        }
    }
}