angular.module('songGraph.orderObjectByFilter', ['ng'])

.filter('orderObjectBy', function () {
  return function (items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function (item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      if (a[field] > b[field]) {
        return 1;
      } else if (a[field] < b[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    if (reverse) {
      filtered.reverse();
    }
    return filtered;
  };
});