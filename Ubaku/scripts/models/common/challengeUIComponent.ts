module app.models {
    "use strict";

    export class ChallengeUIComponent {
        constructor(public type: ChallengeUIComponentType, public content?: any) {
        }

        equals(other: ChallengeUIComponent): boolean {
            if (other === null) {
                return false;
            }
            if (other.type !== this.type) {
                return false;
            }
            if (other.content !== this.content) {
                return false;
            }
            return true;
        }
    }
}