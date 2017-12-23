var Rocket = require('./component/Rocket');
var Warrior = require('./component/Warrior');

// console.log(Rocket, Warrior);

var TeamTemplate = require('./directive/Team');

angular.module('NationalBasketballAssociation', [Rocket.name, Warrior.name])
.directive('basketballTeam', [TeamTemplate]);
