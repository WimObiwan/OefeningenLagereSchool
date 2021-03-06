﻿module app.models {
    "use strict";

    export class ArithmeticChallengeFactory implements IChallengeFactory {
        private originalType: ChallengeFactoryType = null;
        private type: ChallengeFactoryType = null;
        private primaryComponentSequence: SequenceType = null;
        private secondaryComponentSequence: SequenceType = null;
        private minNumber: number = null;
        private maxNumber: number = null;
        private availableAnswers: number[] = [];
        private primaryComponentsQueue: number[] = [];
        private secondaryComponentsQueue: number[] = [];

        public constructor(configuration: ArithmeticChallengeFactoryConfiguration) {
            // Determine the configuration parameters.
            this.originalType = configuration.type || Defaults.ChallengeFactoryType;
            this.primaryComponentSequence = configuration.primaryComponentSequence || Defaults.PrimaryComponentSequenceType;
            this.secondaryComponentSequence = configuration.secondaryComponentSequence || Defaults.SecondaryComponentSequenceType;
            this.minNumber = configuration.minNumber || Defaults.MinNumber;
            this.maxNumber = configuration.maxNumber || Defaults.MaxNumber;

            // Generate the array of available answers.
            this.availableAnswers = ArithmeticChallengeFactory.createArray(0, this.maxNumber, SequenceType.Up);
        }

        public createChallenge(): app.models.IChallenge {
            this.type = this.originalType;
            if (this.type === ChallengeFactoryType.Random) {
                switch (this.getRandomInt(0, 2)) {
                    default:
                    case 0:
                        this.type = ChallengeFactoryType.SplitNumbers;
                        break;
                    case 1:
                        this.type = ChallengeFactoryType.Add;
                        break;
                    case 2:
                        this.type = ChallengeFactoryType.Subtract;
                        break;
                }
            }

            if (this.type === ChallengeFactoryType.SplitNumbers || this.type === ChallengeFactoryType.Subtract || this.type === ChallengeFactoryType.Add) {
                if (this.primaryComponentSequence === SequenceType.Random) {
                    var primaryComponent = this.getRandomInt(this.minNumber, this.maxNumber);
                    var secondaryComponent = this.getRandomInt(0, primaryComponent);
                } else {
                    if (this.primaryComponentsQueue.length === 0) {
                        // There are no more primary components in the current batch, generate a new queue.
                        this.primaryComponentsQueue = ArithmeticChallengeFactory.createArray(this.minNumber, this.maxNumber, this.primaryComponentSequence);
                    }
                    var primaryComponent = this.primaryComponentsQueue[0];

                    if (this.secondaryComponentsQueue.length === 0) {
                        // There are no more secondary components in the current batch, generate a new queue.
                        this.secondaryComponentsQueue = ArithmeticChallengeFactory.createArray(0, primaryComponent, this.secondaryComponentSequence);
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
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.PrimaryComponent, primaryComponent),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + primaryComponent + " kan je splitsen in " + secondaryComponent + " en " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + primaryComponent + " kan je niet splitsen in " + secondaryComponent + " en " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.ArithmeticChallenge(layout, uiComponents, this.availableAnswers, solution,
                        secondaryComponent, solution, 0,
                        correctResponseMessage, incorrectResponseMessage);
                } else if (this.type === ChallengeFactoryType.Subtract) {
                    // Subtract.
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.SecondaryComponent, primaryComponent),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.Ornament, "-"),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + primaryComponent + " min " + secondaryComponent + " is gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + primaryComponent + " min " + secondaryComponent + " is niet gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.ArithmeticChallenge(layout, uiComponents, this.availableAnswers, solution,
                        solution, 0, secondaryComponent,
                        correctResponseMessage, incorrectResponseMessage);
                } else if (this.type === ChallengeFactoryType.Add) {
                    // Add.
                    var layout = ChallengeLayoutType.LeftToRight;
                    var uiComponents = [
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.SecondaryComponent, solution),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.Ornament, "+"),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.SecondaryComponent, secondaryComponent),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.Ornament, "="),
                        new ChallengeUIComponent(ArithmeticChallengeUIComponentType.AnswerPlaceholder)
                    ];
                    var correctResponseMessage = "Goed zo! " + solution + " plus " + secondaryComponent + " is gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    var incorrectResponseMessage = "Jammer! " + solution + " plus " + secondaryComponent + " is niet gelijk aan " + app.models.Constants.StringPlaceholders.Answer + ".";
                    return new app.models.ArithmeticChallenge(layout, uiComponents, this.availableAnswers, primaryComponent,
                        solution, secondaryComponent, 0,
                        correctResponseMessage, incorrectResponseMessage);
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
                ArithmeticChallengeFactory.shuffleArray(values);
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