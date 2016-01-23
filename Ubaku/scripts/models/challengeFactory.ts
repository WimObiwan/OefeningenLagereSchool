module app.models {
    "use strict";

    export class ChallengeFactory {
        private type: ChallengeFactoryType = null;
        private numberToSplitSequence: SequenceType = null;
        private splitComponentSequence: SequenceType = null;
        private minNumberToSplit: number = null;
        private maxNumberToSplit: number = null;
        private availableAnswers: number[] = [];
        private numbersToSplitQueue: number[] = [];
        private splitComponentsQueue: number[] = [];

        public constructor(private configuration: ChallengeFactoryConfiguration) {
            // Determine the configuration parameters.
            this.type = this.configuration.type || Defaults.ChallengeFactoryType;
            this.numberToSplitSequence = this.configuration.options.numberToSplitSequence || Defaults.NumberToSplitSequenceType;
            this.splitComponentSequence = this.configuration.options.splitComponentSequence || Defaults.SplitComponentSequenceType;
            this.minNumberToSplit = this.configuration.options.minNumberToSplit || Defaults.MinNumberToSplit;
            this.maxNumberToSplit = this.configuration.options.maxNumberToSplit || Defaults.MaxNumberToSplit;

            // Generate the array of available answers.
            this.availableAnswers = ChallengeFactory.createArray(0, this.maxNumberToSplit, SequenceType.Up);
        }

        public createChallenge(): app.models.IChallenge {
            if (this.type === ChallengeFactoryType.SplittingNumbers) {
                if (this.numberToSplitSequence === SequenceType.Random) {
                    var numberToSplit = this.getRandomInt(this.minNumberToSplit, this.maxNumberToSplit);
                    var splitComponent = this.getRandomInt(0, numberToSplit);
                } else {
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
                }

                // Determine the solution and create the challenge.
                var solution = numberToSplit - splitComponent;
                return new app.models.Challenge(numberToSplit, splitComponent, this.availableAnswers, solution);
            } else {
                throw new Error("Unknown challenge type: " + this.type);
            }
        }

        private static createArray(min: number, max: number, sequence: SequenceType): number[] {
            var values = new Array<number>(1 + max - min);
            for (var i = 0; i < values.length; i++) {
                values[i] = min + i;
            }
            if (sequence === SequenceType.Up) {
                // Do nothing extra.
            } else if (sequence === SequenceType.Random) {
                ChallengeFactory.shuffleArray(values);
            } else if (sequence === SequenceType.Down) {
                values = values.reverse();
            } else {
                throw new Error("Unknown sequence type: " + sequence);
            }
            return values;
        }

        private static shuffleArray<T>(value: T[]) {
            for (var j: number, x: T, i = value.length; i; j = Math.floor(Math.random() * i), x = value[--i], value[i] = value[j], value[j] = x);
            return value;
        }

        private getRandomInt(minInclusive: number, maxInclusive: number): number {
            return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
        }
    }
}