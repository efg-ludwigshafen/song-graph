angular.module('songGraph.existingDate', ['songGraph.metaService', 'songGraph.pieChartDirective', 'ng', 'ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/date/:date', {
    controller: 'ExistingDateCtrl',
    templateUrl: '/partials/existing-date.tpl.html'
  });
}])

.controller('ExistingDateCtrl', ['$scope', '$http', '$routeParams', '$location', '$filter', 'meta', function ($scope, $http, $routeParams, $location, $filter, meta) {
  if ($routeParams.date.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
    $location.path('/');
  }

  $http.get('/date/' + $routeParams.date).success(function (date) {
    $scope.title = $filter('date')(date.id, 'dd. MMMM yyyy');
    meta.setTitle($scope.title);
    $scope.songs = [];
    date.songs.forEach(function (sng) {
      $http.get('/song/' + sng).success(function (song) {
        $scope.songs.push(song);
      });
    });
    $scope.band = date.band;
  }).error(function (err) {
    console.log(err);
    $location.path('/new/date/');
  });
}]);