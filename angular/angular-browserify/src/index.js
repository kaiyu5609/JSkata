var Rocket = require('./component/Rocket');
var Warrior = require('./component/Warrior');
var Laker = require('./component/Laker');
// console.log(Rocket, Warrior);

var AppConfig = require('./config/AppConfig');

var TeamTemplate = require('./directive/Team');
var LakerTemplate = require('./directive/Laker');

angular.module('NationalBasketballAssociation', ['ui.router', 'oc.lazyLoad', Rocket.name, Warrior.name, Laker.name])
.config(['$stateProvider', '$urlRouterProvider', AppConfig])
.controller('MainCtrl', ['$scope', function($scope) {

}])
.directive('basketballTeam', [TeamTemplate])
.directive('laker', [LakerTemplate]);
