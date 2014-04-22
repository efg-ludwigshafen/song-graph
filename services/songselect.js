var request = require('request')
  , jsdom = require('jsdom')

  , songselect = 'https://de.songselect.com/'
  , songs = songselect + 'songs/'
  , search = songselect + 'search/results?PageSize=10&SearchTerm='
  , id_cache = {}
  , name_cache = {};

exports.findById = function(id, next) {
    if (id_cache[id]) {
        next(undefined, id_cache[id]);
    } else {
        fetchById(id, id_cache, function(err) {
            if (err) {
                next(err);
            } else {
                exports.findById(id, next);
            }
        });
    }
};

function fetchById(id, cache, next) {
    request({url: songs + id, rejectUnauthorized: false}, function(requestError, requestResponse, requestBody) {
        if (requestError) {
            next(requestError);
        } else {
            jsdom.env(requestBody, ['http://code.jquery.com/jquery.min.js'], function(jsdomError, window) {
                if (jsdomError) {
                    next(jsdomError);
                } else {
                    cache[id] = {
                        title: window.document.title,
                        authors: window.$.map(window.$('.authors a'), function(el) { return window.$(el).text() }),
                        excerpt: window.$('.lyrics-prev').html().split('<br>').map(function(line) { return line.trim(); }).join('\n'),
                        year: parseInt(window.$('.copyright').html().split(' ')[1]),
                        songType: 'chant'
                    };
                    if (cache[id].year) {
                        if (cache[id].year > 2000) cache[id].songType = 'new';
                        else if (cache[id].year > 1939) cache[id].songType = 'old';
                    }
                    console.log(cache[id]);
                    next(undefined, cache[id]);
                }
            });
        }
    });
}

exports.findByName = function(name, next) {
    if (name_cache[name]) {
        next(undefined, name_cache[name]);
    } else {
        fetchByName(name, name_cache, function(err) { 
            if (err) {
                next(err);
            } else {
                exports.findByName(name, next);
            }
        });
    }
}

function fetchByName(name, cache, next) {
    request({url: search + name, rejectUnauthorized: false}, function(requestError, requestResponse, requestBody) {
        if (requestError) {
            next(requestError);
        } else {
            jsdom.env(requestBody, ['http://code.jquery.com/jquery.min.js'], function(jsdomError, window) {
                if (jsdomError) {
                    next(jsdomError);
                } else {
                    cache[name] = [];
                    window.$('.song-listing tr > td:first-of-type').each(function(index, element) {
                        cache[name].push({
                            title: window.$(element).find('a[href^="/songs/"]').text(),
                            authors: window.$.map(window.$(element).find('.authors li'), function(el) { return window.$(el).text(); }),
                            id: window.$(element).find('a[href^="/songs/"]').attr('href').split('/')[2]
                        });
                    });
                    next(undefined, cache[name]);
                }
            });
        }
    })
}
