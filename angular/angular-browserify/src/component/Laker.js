var LakerCtrl = require('../controller/LakerCtrl');
var LakerService = require('../service/LakerService');

module.exports = angular.module('Laker', [])
.controller('LakerCtrl', ['$scope', 'LakerService', LakerCtrl])
.service('LakerService', [LakerService]);
