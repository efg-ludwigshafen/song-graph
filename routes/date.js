var router = require('express').Router()
  , service = require('../services/date');

require('express-params').extend(router);
router.param('date', service.validKeyRegex);

// ===== query all ==================================================
router.get('/', function(req, res) {
    service.findAll(function(err, body) {
        if (err)
            res.send(500, 'internal error while finding all dates (reason: ' + err + ')');
        else
            res.json(body);
    });
});

// ===== CRUD =======================================================
router.post('/', function(req, res) {
    service.save(req.body, function(err, body) {
        if (err)
            res.send(500, 'new date could not be created (reason: ' + err + ')');
        else
            res.json(body);
    });
});

router.get('/:date', function(req, res) {
    service.findById(req.params.date, function(err, body) {
        if (err)
            res.send(404, 'date ' + req.params.date + ' not found (reason: ' + err + ')')
        else
            res.json(body);
    });
});

// ===== search =====================================================
router.get('/since/:date', function(req, res) {

});

router.get('/by/band/:band', function(req, res) {
    service.findByBand(req.params.band, function(err, body) {
        if (err)
            res.send(404, 'nothing found for band "' + req.params.band + '" (reason: ' + err + ')');
        else
            res.json(body);
    })
});

module.exports = router;
