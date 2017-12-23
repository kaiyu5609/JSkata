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
