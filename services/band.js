var db = require('nano')(process.env.DB || 'http://localhost:5984/song-graph');

(function init() {
  db.get('_design/band', function (err, body) {
    var views = {
      views: {
        findAll: {
          map: function (doc) { if (doc._id.match(/^\d{4}-\d{2}-\d{2}$/) !== null) { emit([doc.band], null); } },
          reduce: function (keys, values, rereduce) { return null; }
        }
      }
    };
    if (body) {
      views._rev = body._rev;
    }
    db.insert(views, '_design/band', function (err, body) {
      if (err) {
        console.log(err);
      }
    });
  });
}());

exports.findAll = function (next) {
  db.view('band', 'findAll', {
    group: true
  }, function (err, body) {
    if (err) {
      next(err);
    } else {
      next(undefined, body.rows.map(function (row) {
        return row.key[0];
      }));
    }
  });
};