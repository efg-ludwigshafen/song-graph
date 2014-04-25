angular.module('songGraph.landingPage', ['songGraph.metaService', 'songGraph.orderObjectByFilter', 'songGraph.pieChartDirective', 'ng', 'ngRoute', 'ngEnterDirective'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'LandingPageCtrl',
        templateUrl: '/partials/landing-page.tpl.html'
    });
}])

.controller('LandingPageCtrl', ['$scope', '$http', 'meta', function($scope, $http, meta) {
    $scope.title = 'Statistik';
    meta.setTitle($scope.title);

    $http.get('/song/').success(function(result) {
        $scope.charts = result.map(function(song) {
            return angular.extend({}, song, { numPlayed: song.history.length });
        });
    });
}]);
