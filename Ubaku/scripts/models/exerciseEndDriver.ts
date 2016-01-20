module app.models {
    "use strict";

    export class ExerciseEndDriver {
        public constructor(private configuration: ExerciseEndDriverConfiguration) {
        }

        public shouldEnd(exercise: IExercise): boolean {
            var exerciseEndDriverType = this.configuration.type || ExerciseEndDriverConfiguration.TypeInfinite;

            // TODO-H

            return false;
        }
    }
}