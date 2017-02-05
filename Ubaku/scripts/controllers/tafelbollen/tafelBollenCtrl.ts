module app.tafelbollen {
    "use strict";

    interface ITafelBollenScope extends ng.IScope {
        configuration: app.models.ExerciseConfiguration;
        exerciseDriver: app.models.IExerciseDriver;
        startExercise(): void;
        stopExercise(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    class TafelBollenCtrl {
        public static $inject = ["$scope", "$interval"];
        public constructor(private $scope: ITafelBollenScope, private $interval: ng.IIntervalService) {
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
            this.$scope.exerciseDriver = new app.models.ExerciseDriver(
                new app.models.TafelBollenChallengeFactory(configuration.tafelBollenChallengeFactory),
                configuration, this.$interval);
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

            configuration.tafelBollenChallengeFactory = new app.models.TafelBollenChallengeFactoryConfiguration();
            configuration.tafelBollenChallengeFactory.minNumber = 11;
            configuration.tafelBollenChallengeFactory.maxNumber = 40;

            configuration.challengeDriver.completeType = app.models.ChallengeCompleteType.Solved;
            configuration.challengeDriver.completeAfterSeconds = 10;

            return configuration;
        }

        private clone<T>(value: T): T {
            return JSON.parse(JSON.stringify(value));
        }
    }

    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.TafelBollen, TafelBollenCtrl);
}