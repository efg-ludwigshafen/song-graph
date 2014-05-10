angular.module('songGraph.song', ['ng', 'ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/song/:song', {
    controller: 'SongCtrl',
    templateUrl: '/partials/song.tpl.html'
  });
}])

.controller('SongCtrl', ['$scope', '$http', '$routeParams', '$location', 'meta', function ($scope, $http, $routeParams, $location, meta) {
  if ($routeParams.song.match(/^\d+$/) === null) {
    $location.path('/');
  } else {
    $http.get('/song/' + $routeParams.song).success(function (song) {
      $scope.id = song.id;
      $scope.title = song.title;
      $scope.authors = song.authors;
      $scope.excerpt = song.excerpt.split('\n');
      $scope.songType = song.songType;
      $scope.history = song.history;
      meta.setTitle($scope.title);

      $scope.save = function () {
        var song = {
          id: $scope.id,
          title: $scope.title,
          authors: $scope.authors,
          excerpt: $scope.excerpt.join('\n'),
          songType: $scope.songType,
          history: $scope.history
        };
        if (song.id) {
          $http.post('/song/' + song.id, song).error(function (result) {
            console.log(result);
          });
        }
      };

      $scope.$watch('songType', $scope.save);
    });
  }
}]);