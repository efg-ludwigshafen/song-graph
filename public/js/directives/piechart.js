angular.module('songGraph.pieChartDirective', ['highcharts-ng', 'ng'])

.directive('piechart', [function () {
  return {
    restrict: 'E',
    scope: {
      songs: '=',
      classes: '@class'
    },
    template: '<highchart config="chart" class="classes"></highchart>',
    link: function ($scope, element, attrs) {
      $scope.$watch('songs', function (newValue) {
        if ($scope.songs) {
          $scope.chart = {
            options: {
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
              data: [{
                name: 'neu',
                y: $scope.songs.filter(function (s) {
                  return s.songType === 'new';
                }).length,
                color: '#00aba9'
                          }, {
                name: 'alt',
                y: $scope.songs.filter(function (s) {
                  return s.songType === 'old';
                }).length,
                color: '#f09609'
                          }, {
                name: 'Choral',
                y: $scope.songs.filter(function (s) {
                  return s.songType === 'chant';
                }).length,
                color: '#339933'
                          }],
              type: 'pie'
                      }],
            title: {
              text: 'Lieder nach Typ'
            },
            formatter: function () {
              return Math.round(this.percentage * 100) / 100 + '%';
            }
          };
        }
      }, true);
    }
  };
}]);