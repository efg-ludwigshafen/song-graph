angular.module('songGraph', ['songGraph.metaService', 'songGraph.landingPage', 'songGraph.existingDate', 'songGraph.newDate', 'songGraph.song', 'songGraph.band', 'ng', 'ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
}])

.controller('AppCtrl', ['$scope', 'meta', '$location', '$http', '$filter', function($scope, meta, $location, $http, $filter) {
    $scope.meta = meta;
    $scope.$location = $location;

    $scope.gotoDate = $filter('date')(new Date(), 'yyyy-mm-dd');

    meta.setSuffix('efglu');

    angular.element('.dropdown-menu form').click(function(e) {
        e.stopPropagation();
    });

    $http.get('/band/').success(function(result) {
        $scope.bands = result;
    });
	
	$http.get('/date/').success(function(result) {
		$scope.dates = result;
	});
}]);
