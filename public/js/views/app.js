angular.module('songGraph', ['songGraph.metaService', 'songGraph.songService', 'songGraph.landingPage', 'songGraph.existingDate', 'songGraph.newDate', 'songGraph.song', 'songGraph.band', 'songGraph.configurationService', 'ng', 'ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(false);
  $locationProvider.hashPrefix('!');
}])

.controller('AppCtrl', ['$scope', 'meta', 'conf', 'song', '$location', '$http', '$filter', function ($scope, meta, conf, song, $location, $http, $filter) {
  $scope.meta = meta;
  meta.setSuffix(conf.name);
  meta.setSeparator(' | ');
  $scope.$location = $location;

  $http.get('/band/').success(function (result) {
    $scope.bands = result;
  });

  $http.get('/date/').success(function (result) {
    $scope.dates = result;
  });
  
  $scope.songService = song;
  
  $scope.$on('$locationChangeStart', function() {
    $scope.song = undefined;
  });
}]);