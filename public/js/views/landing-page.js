angular.module('songGraph.landingPage', ['songGraph.metaService', 'songGraph.orderObjectByFilter', 'ng', 'ngRoute', 'ngEnterDirective'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'LandingPageCtrl',
        templateUrl: '/partials/landing-page.tpl.html'
    });
}])

.controller('LandingPageCtrl', ['$scope', '$http', 'meta', function($scope, $http, meta) {
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
            name: 'Gesamt',
            data: []
        }],
        title: { text: 'Lieder nach Typ' },
        loading: true,
        formatter: function() {
            return Math.round(this.percentage*100) / 100 + '%'
        }
    };
    $scope.dates = {};
    $scope.title = 'Statistik';
    meta.setTitle($scope.title);

    $http.get('/date/').success(function(result) {
        result.forEach(function(date) {
            $scope.dates[date.id] = {
                band: date.band,
                songs: [],
                title: date.id
            };
            date.songs.forEach(function(song) {
                $http.get('/song/' + song).success(function(result) {
                    $scope.dates[date.id].songs.push(result);
                    $scope.songsAsChart.series[0].data = [
                        {
                            name: 'neu',
                            y: $scope.songsOfType('new'),
                            color: '#9954bb'
                        }, {
                            name: 'alt',
                            y: $scope.songsOfType('old'),
                            color: '#ff7518'
                        }, {
                            name: 'Choral',
                            y: $scope.songsOfType('chant'),
                            color: '#3fb618'
                        }
                    ];
                    $scope.songsAsChart.loading = false;
                });
            });
        })
    });

    $scope.songsOfType = function(type) {
        return Object.keys($scope.dates)
            .map(function(dateKey) {
                return $scope.songsOfTypeInList($scope.dates[dateKey].songs, type);
            })
            .reduce(function(a, b) { return a + b });
    };

    $scope.songsOfTypeInList = function(haystack, type) {
        return haystack.filter(function(s) { return s.songType == type}).length
    };

    $http.get('/song/').success(function(result) {
        $scope.charts = result.map(function(song) {
            return angular.extend({}, song, { numPlayed: song.history.length });
        });
    });
}]);
