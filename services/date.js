var db = require('nano')(process.env.DB || 'http://localhost:5984/song-graph');

(function init() {
    db.get('_design/date', function(err, body) {
        var views = {
                views: {
                    findAll: {
                        map: function(doc) { if (doc._id.match(/^\d{4}-\d{2}-\d{2}$/) !== null) { emit(doc._id, doc); } }
                    },
                    findBySong: {
                        map: function(doc) { if (doc._id.match(/^\d{4}-\d{2}-\d{2}$/) !== null && doc.songs) { doc.songs.forEach(function(song) { emit(song, doc._id); }); } }
                    },
                    findByBand: {
                        map: function(doc) { if (doc._id.match(/^\d{4}-\d{2}-\d{2}$/) !== null && doc.band) { emit(doc.band, doc); } }
                    }
                }
            };
        if (body) {
            views._rev = body._rev;
        }
        db.insert(views, '_design/date', function(err, body) {
            if (err) { console.log(err); }
        });
    });
})();

exports.validKeyRegex = /^\d{4}-\d{2}-\d{2}$/;

exports.isValidKey = function(key) {
    return new String(key).match(exports.validKeyRegex) !== null;
};

exports.findAll = function(next) {
    db.view('date', 'findAll', {}, function(err, body) {
        if (err) { next(err); }
        else {
            next(undefined, body.rows.map(cleanViewResult).reverse());
        }
    });
};

function cleanViewResult(row) {
    var key;
    row.value.id = row.value._id;
    for (key in row.value) {
        if (row.value.hasOwnProperty(key) && key.indexOf('_') === 0) {
            delete row.value[key];
        }
    }
    return row.value;
}

exports.findById = function(id, next) {
    if (!exports.isValidKey(id)) {
        next('malformed id "' + id + '" (must be yyyy-mm-dd)');
    } else {
        db.get(id, function(err, result) {
            if (err) {
                next(err);
            } else {
                next(undefined, cleanViewResult(result));
            }
        });
    }
};

exports.findByBand = function(band, next) {
    db.view('date', 'findByBand', {key: band}, function(err, body) {
        if (err) {
            next(err);
        } else {
            next(undefined, body.rows.map(cleanViewResult).reverse());
        }
    });
};

exports.save = function(body, next) {
    if (!body) {
        next('no object to save');
    } else if (!body.id) {
        next('id field required but not found');
    } else if (!exports.isValidKey(body.id)) {
        next('id field malformed (must be "yyyy-mm-dd")');
    } else {
        body._id = body.id;
        delete body.id;

        db.get(body._id, function(err, result) {
            if (result) {
                body._rev = result._rev;
            }
            db.insert(body, body._id, function(err, result) {
                if (err) {
                    next(err);
                } else { 
                    next(undefined, { id: body._id });
                }
            });
        });
    }
};
