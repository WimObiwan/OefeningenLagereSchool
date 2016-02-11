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
            // TODO-L: Rename options / fields / variables etc to be more generic (not only about splitting numbers anymore).
            if (this.type === ChallengeFactoryType.SplitNumbers || this.type === ChallengeFactoryType.Subtract || this.type === ChallengeFactoryType.Add) {
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

                if (this.type === ChallengeFactoryType.SplitNumbers) {
                    var layout = ChallengeLayoutType.SplitTop;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.PrimaryComponent, numberToSplit),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, splitComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + numberToSplit + " kan je splitsen in " + splitComponent + " en {answer}.";
                    var incorrectResponseMessage = "Jammer! " + numberToSplit + " kan je niet splitsen in " + splitComponent + " en {answer}.";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, solution, correctResponseMessage, incorrectResponseMessage);
                } else if (this.type === ChallengeFactoryType.Subtract) {
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, numberToSplit),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "-"),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, splitComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + numberToSplit + " min " + splitComponent + " is gelijk aan {answer}.";
                    var incorrectResponseMessage = "Jammer! " + numberToSplit + " min " + splitComponent + " is niet gelijk aan {answer}.";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, solution, correctResponseMessage, incorrectResponseMessage);
                } else {
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, solution),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "+"),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, splitComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + solution + " plus " + splitComponent + " is gelijk aan {answer}.";
                    var incorrectResponseMessage = "Jammer! " + solution + " plus " + splitComponent + " is niet gelijk aan {answer}.";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, numberToSplit, correctResponseMessage, incorrectResponseMessage);
                }
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