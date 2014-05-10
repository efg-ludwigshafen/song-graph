angular.module('songGraph.songService', ['ng'])

.factory('song', ['$http', function($http) {
  return {
    songsByPrefix: function (prefix) {
      return $http.get('/song/by/prefix/' + prefix).then(function (result) {
        return result.data;
      });
    }
  };
}]);