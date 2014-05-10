angular.module('songGraph.newDate', ['songGraph.songService', 'ng', 'ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/new/date', {
    controller: 'NewDateCtrl',
    templateUrl: '/partials/new-date.tpl.html'
  });
}])

.controller('NewDateCtrl', ['$scope', '$http', '$location', '$filter', 'meta', 'song', function ($scope, $http, $location, $filter, meta, song) {
  meta.setTitle('Gottesdienst hinzufügen');

  $scope.id = $filter('date')(new Date(), 'yyyy-MM-dd');
  $scope.songs = [];
  $scope.newSong = undefined;
  $scope.band = undefined;

  $scope.save = function () {
    var date = {
      id: $scope.id,
      songs: $scope.songs.map(function (song) { return song.id; }),
      band: $scope.band
    };
    $http.post('/date/', date).success(function (result) {
      $location.path('/date/' + result.id);
    });
  };
  
  $scope.songService = song;
}]);