angular.module('songGraph.metaService', ['ng'])

.factory('meta', [function() {
    var title = undefined
      , suffix = 'songGraph'
      , separator = ' | ';

    return {
        title: function() { return [title, suffix].filter(function(e) { return e; }).join(separator); },
        suffix: function() { return suffix; },
        setTitle: function(t) { title = t; },
        setSuffix: function(suf) { suffix = suf; },
        setSeparator: function(sep) { separator = sep; }
    };
}]);
