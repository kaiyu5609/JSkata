var TeamCtrl = require('../controller/TeamCtrl');
var WorriorService = require('../service/WorriorService');

module.exports = angular.module('Worrior', [])
.controller('WorriorCtrl', ['$scope', 'WorriorService', TeamCtrl])
.service('WorriorService', [WorriorService]);
