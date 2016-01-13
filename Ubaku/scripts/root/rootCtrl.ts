module app {
    'use strict';

    interface IRootCtrl {
    }

    class RootCtrl implements IRootCtrl {

        //static $inject = [];
        constructor() {
        }
    }

    angular.module("app").controller("rootCtrl", RootCtrl);
}