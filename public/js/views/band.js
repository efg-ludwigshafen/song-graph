angular.module('songGraph.band', ['songGraph.orderObjectByFilter', 'songGraph.pieChartDirective', 'ng', 'ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/band/:band', {
    controller: 'BandCtrl',
    templateUrl: '/partials/band.tpl.html'
  });
}])

.controller('BandCtrl', ['$scope', '$http', '$routeParams', 'meta', function ($scope, $http, $routeParams, meta) {
  $scope.dates = {};
  $scope.songs = [];
  $scope.title = $routeParams.band;
  meta.setTitle($scope.title);

  $http.get('/date/by/band/' + $routeParams.band).success(function (result) {
    result.forEach(function (date) {
      $scope.dates[date.id] = {
        band: date.band,
        title: date.id,
        songs: []
      };
      date.songs.forEach(function (sng) {
        $http.get('/song/' + sng).success(function (song) {
          $scope.dates[date.id].songs.push(song);
          $scope.songs.push(song);
        });
      });
    });
  });

  $scope.songsOfTypeInList = function (haystack, type) {
    return haystack.filter(function (s) {
      return s.songType === type;
    }).length;
  };
}]);