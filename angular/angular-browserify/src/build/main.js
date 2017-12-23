(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TeamCtrl = require('../controller/TeamCtrl');
var RocketService = require('../service/RocketService');

module.exports = angular.module('Rocket', [])
.controller('RocketCtrl', ['$scope', 'RocketService', TeamCtrl])
.service('RocketService', [RocketService]);

},{"../controller/TeamCtrl":3,"../service/RocketService":6}],2:[function(require,module,exports){
var TeamCtrl = require('../controller/TeamCtrl');
var WorriorService = require('../service/WorriorService');

module.exports = angular.module('Worrior', [])
.controller('WorriorCtrl', ['$scope', 'WorriorService', TeamCtrl])
.service('WorriorService', [WorriorService]);

},{"../controller/TeamCtrl":3,"../service/WorriorService":7}],3:[function(require,module,exports){
module.exports = function($scope, TeamService) {
    var teams = {
        'rocket': '休斯顿-火箭队',
        'worrior': '金州-勇士队'
    };
    var name = TeamService.name
    $scope.name = teams[name];

    // Members
    $scope.setMembers = function(members) {
        localStorage.setItem(name, JSON.stringify(members));
    };

    $scope.getMembers = function() {
        members = localStorage.getItem(name);
        if (members) {
            members = JSON.parse(members);
        } else {
            members = [];
        }
        return members;
    };

    $scope.members = $scope.getMembers();


    // AddMember
    $scope.newMember = '';
    $scope.addMember = function(newMember) {
        if (!newMember) { return; }
        $scope.members.push({
            name: newMember
        });
        $scope.setMembers($scope.members);
        $scope.newMember = '';
    };


    // DelMember
    $scope.deleteMember = function(deleteMember) {
        _.remove($scope.members, function(member) {
            return member === deleteMember;
        });
        $scope.setMembers($scope.members);
    };


};

},{}],4:[function(require,module,exports){
module.exports = function() {
    return {
        restrict: 'EA',
        template: '<div class="container">'+
            '<div class="members list-group">'+
                '<div class="list-group-item member" ng-repeat="member in members track by $index">'+
                    '<span ng-bind="member.name"></span>'+
                    '<button type="button" class="close" aria-label="Close" ng-click="deleteMember(member)">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>'+
            '</div>'+

            '<div class="input-group">'+
                '<input type="text" class="form-control" placeholder="请输入{{name}}员的名称" ng-model="newMember" />'+
                '<span class="input-group-btn">'+
                    '<button class="btn btn-primary" type="button" ng-click="addMember(newMember)">添加</button>'+
                '</span>'+
            '</div>'+
        '</div>',
        replace: true,
        scope: false,
        link: function(scope, element, attrs) {}
    };
};

},{}],5:[function(require,module,exports){
var Rocket = require('./component/Rocket');
var Warrior = require('./component/Warrior');

// console.log(Rocket, Warrior);

var TeamTemplate = require('./directive/Team');

angular.module('NationalBasketballAssociation', [Rocket.name, Warrior.name])
.directive('basketballTeam', [TeamTemplate]);

},{"./component/Rocket":1,"./component/Warrior":2,"./directive/Team":4}],6:[function(require,module,exports){
module.exports = function() {
    this.name = 'rocket';
};

},{}],7:[function(require,module,exports){
module.exports = function() {
    this.name = 'worrior';
};

},{}]},{},[5])

