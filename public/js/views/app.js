angular.module('songGraph', ['songGraph.metaService', 'songGraph.landingPage', 'songGraph.existingDate', 'songGraph.newDate', 'songGraph.song', 'songGraph.band', 'songGraph.configurationService', 'ng', 'ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
}])

.controller('AppCtrl', ['$scope', 'meta', 'conf', '$location', '$http', '$filter', function($scope, meta, conf, $location, $http, $filter) {
    $scope.meta = meta;
    meta.setSuffix(conf.name);
    meta.setSeparator(' | ');
    $scope.$location = $location;

    $http.get('/band/').success(function(result) {
        $scope.bands = result;
    });
	
	$http.get('/date/').success(function(result) {
		$scope.dates = result;
	});
}]);
