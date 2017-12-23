var TeamCtrl = require('../controller/TeamCtrl');
var RocketService = require('../service/RocketService');

module.exports = angular.module('Rocket', [])
.controller('RocketCtrl', ['$scope', 'RocketService', TeamCtrl])
.service('RocketService', [RocketService]);
