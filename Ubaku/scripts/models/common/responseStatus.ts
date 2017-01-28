module app.models {
    "use strict";

    export class ResponseStatus {
        constructor(public response: IResponse, public message: string, public messageSeverity: Severity) {
        }
    }
}