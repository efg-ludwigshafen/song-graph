var async = require('async')
  , extend = require('extend')
  , db = require('nano')(process.env.DB || 'http://localhost:5984/song-graph')
  , songselect = require('./songselect');

(function init() {
    db.get('_design/song', function(err, body) {
        var views = {
                views: {
                    findAll: {
                        map: function(doc) { if (doc._id.match(/^\d+$/) != null) { emit(doc._id, doc); } }
                    },
                    findByName: {
                        map: function(doc) { if (doc._id.match(/^\d+$/) != null) emit(doc.title, doc); }
                    },
                    findByNamePrefix: {
                        map: function(doc) { if (doc._id.match(/^\d+$/) != null) { for (var i = 0; i < doc.title.length; i++) { emit(doc.title.toLowerCase().substring(0, i+1), doc) } } }
                    }
                }
            };
        if (body) views._rev = body._rev;
        db.insert(views, '_design/song', function(err, body) {
            if (err) console.log(err);
        });
    });
})();

exports.validKeyRegex = /^\d+$/;

exports.isValidKey = function(key) {
    return new String(key).match(exports.validKeyRegex) !== null;
};

exports.findAll = function(next) {
    db.view('song', 'findAll', {}, function(err, body) {
        var result = [];
        if (err) next(err);
        else {
            result = body.rows.map(function(row) {
                row.value.id = row.value._id;
                for (var key in row.value) {
                    if (row.value.hasOwnProperty(key) && key.indexOf('_') == 0) {
                        delete row.value[key];
                    }
                }
                delete row.value.excerpt;
                delete row.value.year;
                return row.value;
            });
            async.parallel(result.map(function(song) {
                return function(cb) {
                    db.view('date', 'findBySong', { key: song.id + '' }, function(viewError, viewBody) {
                        if (viewError) {
                            cb(viewError);
                        } else {
                            cb(undefined, extend(song, { history: viewBody.rows.map(function(row) { return row.value; }) }));
                        }
                    });
                }
            }), function(errors, results) {
                if (errors) next(errors);
                else next(undefined, results);
            });
        }
    });
};

exports.findById = function(id, next) {
    id = new String(id);

    if (!exports.isValidKey(id))
        next('"' + id + '" is not a valid song key (must match ' + exports.validKeyRegex + ')');
    else
        async.parallel([
                function(cb) {
                    db.get(id, function(err, getBody) {
                        if (err)
                            // song not found -> insert it from songselect
                            songselect.findById(id, function(err, body) {
                                if (err)
                                    cb(err);
                                else {
                                    // got it -> save to database
                                    body._id = id;
                                    if (getBody) body._rev = getBody._rev;
                                    db.insert(body, body._id, function(err, insertBody) {
                                        if (err)
                                            cb(err);
                                        else
                                            cb(undefined, body);
                                    });
                                }
                            });
                        else {
                            // song already in database -> do not need to ask songselect
                            getBody.id = getBody._id;
                            delete getBody._id;
                            delete getBody._rev;
                            cb(undefined, getBody);
                        }
                    })
                },
                function(cb) {
                    db.view('date', 'findBySong', { key: id + '' }, function(viewError, viewBody) {
                        if (viewError) {
                            cb(viewError);
                        } else {
                            cb(undefined, { history: viewBody.rows.map(function(row) { return row.value; }) });
                        }
                    });
                }
            ], function(error, results) {
                var result = {};
                if (error) {
                    next(error);
                } else {
                    results.forEach(function(r) {
                        result = extend(result, r);
                    });
                    next(undefined, result);
                }
            });
};

exports.save = function(body, next) {
    console.log(body);
    if (!body)
        next('no object to save')
    else if (!body.id)
        next('id field required but not found')
    else if (!exports.isValidKey(body.id))
        next('id field malformed (must match ' + exports.validKeyRegex + ')')
    else {
        body._id = body.id;
        delete body.id;

        db.get(body._id, function(err, result) {
            if (result) body._rev = result._rev;
            db.insert(body, body._id, function(err, result) {
                if (err) next(err);
                else next(undefined, { id: body._id });
            });
        });
    }
}

exports.findByNamePrefix = function(name, next) {
    songselect.findByName(name, next);
    // db.view('song', 'findByNamePrefix', { key: name }, function(err, body) {
    //     if (err) next(err);
    //     else {
    //         next(undefined, body.rows.map(function(row) {
    //             var result = row.value;
    //             result.id = result._id;
    //             for (var key in result) {
    //                 if (result.hasOwnProperty(key) && key.indexOf('_') == 0) {
    //                     delete result[key];
    //                 }
    //             }
    //             return result;
    //         }));
    //     }
    // });
}
