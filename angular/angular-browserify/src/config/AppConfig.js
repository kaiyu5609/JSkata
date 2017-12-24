module.exports = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/rocket/1');
    $stateProvider.state('rocket', {
        url: '/rocket/{id}',
        templateUrl: './view/rocket.html',
        resolve: {
            team: function() {
                return {
                    name: '火箭'
                };
            },
            deps: ['$ocLazyLoad', function($ocLazyLoad){
                return $ocLazyLoad.load('./controller/rocket.js');
            }]
        },
        controller: function($scope, $stateParams, team) {
            console.log($stateParams);
            console.log(team);
            $scope.name = team.name;
        }
    }).state('rocket.harden', {
        url: '/harden',
        template: '<div class="container">哈登</div>'
    }).state('worrior', {
        url: '/worrior/{id}',
        templateUrl: './view/worrior.html',
        resolve: {
            team: function() {
                return {
                    name: '勇士'
                };
            },
            deps: ['$ocLazyLoad', function($ocLazyLoad){
                return $ocLazyLoad.load('./controller/worrior.js');
            }]
        },
        controller: function($scope, $stateParams, team) {
            console.log($stateParams);
            console.log(team);
            $scope.name = team.name;
        }
    })
};
