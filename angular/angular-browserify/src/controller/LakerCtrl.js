module.exports = function($scope, LakerService) {
    $scope.name = LakerService.name;
    $scope.speak = function(word) {
        console.log(word);
    };
};
