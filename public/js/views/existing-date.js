angular.module('songGraph.existingDate', ['songGraph.metaService', 'highcharts-ng', 'ng', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/date/:date', {
        controller: 'ExistingDateCtrl',
        templateUrl: '/partials/existing-date.tpl.html'
    });
}])

.controller('ExistingDateCtrl', ['$scope', '$http', '$routeParams', '$location', '$filter', 'meta', function($scope, $http, $routeParams, $location, $filter, meta) {
    if ($routeParams.date.match(/^\d{4}-\d{2}-\d{2}$/) === null)
        $location.path('/');

    $scope.songsAsChart = {
        options: {
            chart: { type: 'pie' },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.0f}%'
                    }
                }
            }
        },
        series: [{
            data: []
        }],
        title: { text: 'Lieder nach Typ' },
        loading: true,
        formatter: function() {
            return Math.round(this.percentage*100) / 100 + '%'
        }
    };

    $http.get('/date/' + $routeParams.date).success(function(date) {
        $scope.title = $filter('date')(date.id, 'dd. MMMM yyyy');
        meta.setTitle($scope.title);
        $scope.songsAsChart.series[0].name = $scope.title;
        $scope.songs = [];
        date.songs.forEach(function(sng) {
            $http.get('/song/' + sng).success(function(song) {
                $scope.songs.push(song);
                $scope.songsAsChart.series[0].data = [
                    {
                        name: 'neu',
                        y: $scope.songs.filter(function(s) { return s.songType == 'new' }).length,
                        color: '#9954bb'
                    }, {
                        name: 'alt',
                        y: $scope.songs.filter(function(s) { return s.songType == 'old' }).length,
                        color: '#ff7518'
                    }, {
                        name: 'Choral',
                        y: $scope.songs.filter(function(s) { return s.songType == 'chant' }).length,
                        color: '#3fb618'
                    }
                ];
                $scope.songsAsChart.loading = false;
            });
        });
        $scope.band = date.band;
    }).error(function(err) {
        console.log(err);
        $location.path('/new/date/')
    });
}]);
