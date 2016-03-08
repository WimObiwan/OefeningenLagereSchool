module app.models {
    "use strict";

    export class ChallengeFactory {
        private type: ChallengeFactoryType = null;
        private primaryComponentSequence: SequenceType = null;
        private secondaryComponentSequence: SequenceType = null;
        private minNumber: number = null;
        private maxNumber: number = null;
        private availableAnswers: number[] = [];
        private primaryComponentsQueue: number[] = [];
        private secondaryComponentsQueue: number[] = [];

        public constructor(private configuration: ChallengeFactoryConfiguration) {
            // Determine the configuration parameters.
            this.type = this.configuration.type || Defaults.ChallengeFactoryType;
            this.primaryComponentSequence = this.configuration.primaryComponentSequence || Defaults.PrimaryComponentSequenceType;
            this.secondaryComponentSequence = this.configuration.secondaryComponentSequence || Defaults.SecondaryComponentSequenceType;
            this.minNumber = this.configuration.minNumber || Defaults.MinNumber;
            this.maxNumber = this.configuration.maxNumber || Defaults.MaxNumber;

            // Generate the array of available answers.
            this.availableAnswers = ChallengeFactory.createArray(0, this.maxNumber, SequenceType.Up);
        }

        public createChallenge(): app.models.IChallenge {
            if (this.type === ChallengeFactoryType.SplitNumbers || this.type === ChallengeFactoryType.Subtract || this.type === ChallengeFactoryType.Add) {
                if (this.primaryComponentSequence === SequenceType.Random) {
                    var primaryComponent = this.getRandomInt(this.minNumber, this.maxNumber);
                    var secondaryComponent = this.getRandomInt(0, primaryComponent);
                } else {
                    if (this.primaryComponentsQueue.length === 0) {
                        // There are no more primary components in the current batch, generate a new queue.
                        this.primaryComponentsQueue = ChallengeFactory.createArray(this.minNumber, this.maxNumber, this.primaryComponentSequence);
                    }
                    var primaryComponent = this.primaryComponentsQueue[0];

                    if (this.secondaryComponentsQueue.length === 0) {
                        // There are no more secondary components in the current batch, generate a new queue.
                        this.secondaryComponentsQueue = ChallengeFactory.createArray(0, primaryComponent, this.secondaryComponentSequence);
                    }
                    var secondaryComponent = this.secondaryComponentsQueue[0];

                    // Take a secondary component from the queue.
                    this.secondaryComponentsQueue = this.secondaryComponentsQueue.splice(1);
                    if (this.secondaryComponentsQueue.length === 0) {
                        // If the last secondary component was taken, move to the next primary component in the queue.
                        this.primaryComponentsQueue = this.primaryComponentsQueue.splice(1);
                    }
                }

                // Determine the solution and create the challenge.
                var solution = primaryComponent - secondaryComponent;

                if (this.type === ChallengeFactoryType.SplitNumbers) {
                    // Split Numbers.
                    var layout = ChallengeLayoutType.SplitTop;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.PrimaryComponent, primaryComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + primaryComponent + " kan je splitsen in " + secondaryComponent + " en " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + primaryComponent + " kan je niet splitsen in " + secondaryComponent + " en " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, solution, correctResponseMessage, incorrectResponseMessage);
                } else if (this.type === ChallengeFactoryType.Subtract) {
                    // Subtract.
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, primaryComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "-"),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + primaryComponent + " min " + secondaryComponent + " is gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + primaryComponent + " min " + secondaryComponent + " is niet gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, solution, correctResponseMessage, incorrectResponseMessage);
                } else if (this.type === ChallengeFactoryType.Add) {
                    // Add.
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, solution),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "+"),
                        new ChallengeUIComponent(ChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + solution + " plus " + secondaryComponent + " is gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + solution + " plus " + secondaryComponent + " is niet gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.Challenge(layout, uiComponents, this.availableAnswers, primaryComponent, correctResponseMessage, incorrectResponseMessage);
                }
            }
            throw new Error("Unknown challenge type: " + this.type);
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