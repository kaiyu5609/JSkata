module.exports = function() {
    return {
        restrict: 'EA',
        template: '<div class="container">'+
            '<p ng-bind="name"></p>'+
            '<p ng-bind="job"></p>'+
            '<button type="button" class="btn btn-primary btn-xs" ng-click="speak({name: name, job: job})">点击</button>'+
        '</div>',
        replace: true,
        scope: {
            name: '=',
            job: '@',
            speak: '&'
        },
        link: function(scope, element, attrs) {
            var speak = scope.speak({name: '345', job: '555'});
        }
    };
};
