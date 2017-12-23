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
