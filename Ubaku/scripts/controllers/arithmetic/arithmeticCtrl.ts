module app.arithmetic {
    "use strict";

    interface IArithmeticScope extends ng.IScope {
        configuration: app.models.ExerciseConfiguration;
        exerciseDriver: app.models.IExerciseDriver;
        startExercise(): void;
        stopExercise(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    class ArithmeticCtrl {
        public static $inject = ["$scope", "$interval"];
        public constructor(private $scope: IArithmeticScope, private $interval: ng.IIntervalService) {
            this.$scope.configuration = this.getDefaultConfiguration();
            this.$scope.startExercise = () => this.startExercise();
            this.$scope.stopExercise = () => this.stopExercise();
            this.$scope.respondToCurrentChallenge = (answer) => this.$scope.exerciseDriver.respondToCurrentChallenge(answer);
            this.$scope.skipCurrentChallenge = () => this.$scope.exerciseDriver.skipCurrentChallenge();
            this.$scope.exerciseDriver = null;
        }

        public startExercise(): void {
            var configuration = this.clone(this.$scope.configuration);
            if (this.$scope.exerciseDriver !== null) {
                this.$scope.exerciseDriver.stop();
            }
            var arithmeticChallengeFactory = new app.models.ArithmeticChallengeFactory(configuration.arithmeticChallengeFactory);
            this.$scope.exerciseDriver = new app.models.ExerciseDriver(arithmeticChallengeFactory, configuration, this.$interval);
            this.$scope.exerciseDriver.start();
        }

        public stopExercise(): void {
            this.$scope.exerciseDriver.stop();
            this.$scope.exerciseDriver = null;
        }

        private getDefaultConfiguration(): app.models.ExerciseConfiguration {
            var configuration = new app.models.ExerciseConfiguration();

            configuration.exerciseCompleteDriver.type = app.models.ExerciseCompleteDriverType.Infinite;
            configuration.exerciseCompleteDriver.completeAfterChallengesCompleted = 10;
            configuration.exerciseCompleteDriver.completeAfterChallengesSolved = 10;
            configuration.exerciseCompleteDriver.completeAfterMinutes = 12;

            configuration.arithmeticChallengeFactory = new app.models.ArithmeticChallengeFactoryConfiguration();
            configuration.arithmeticChallengeFactory.type = app.models.ChallengeFactoryType.Random;
            configuration.arithmeticChallengeFactory.minNumber = 0;
            configuration.arithmeticChallengeFactory.maxNumber = 10;
            configuration.arithmeticChallengeFactory.primaryComponentSequence = app.models.SequenceType.Random;
            configuration.arithmeticChallengeFactory.secondaryComponentSequence = app.models.SequenceType.Up;

            configuration.challengeDriver.completeType = app.models.ChallengeCompleteType.Solved;
            configuration.challengeDriver.endType = app.models.ChallengeEndType.ChallengeComplete;
            configuration.challengeDriver.completeAfterSeconds = 10;

            return configuration;
        }

        private clone<T>(value: T): T {
            return JSON.parse(JSON.stringify(value));
        }
    }

    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.Arithmetic, ArithmeticCtrl);
}