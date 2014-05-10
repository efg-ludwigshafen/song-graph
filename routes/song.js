var router = require('express').Router(),
  service = require('../services/song');

require('express-params').extend(router);
router.param('song', service.validKeyRegex);

router.get('/', function (req, res) {
  service.findAll(function (err, body) {
    if (err) {
      res.send(500, 'internal error while querying all songs (reason: ' + err + ')');
    } else {
      res.json(body);
    }
  });
});

/* get single */
router.get('/:song', function (req, res) {
  service.findById(req.params.song, function (err, body) {
    if (err) {
      res.send(500, 'song "' + req.params.song + '" not found (reason: ' + err + ')');
    } else {
      res.json(body);
    }
  });
});

router.post('/:song', function (req, res) {
  service.save(req.body, function (err, body) {
    if (err) {
      res.send(500, 'song "' + req.params.song + '" could not be saved (reason: ' + err + ')');
    } else {
      res.json(body);
    }
  });
});

router.get('/by/prefix/:name', function (req, res) {
  service.findByNamePrefix(req.params.name.toLowerCase(), function (err, body) {
    if (err) {
      res.send(500, 'song "' + req.params.name + '" not found (reason: ' + err + ')');
    } else {
      res.json(body);
    }
  });
});

module.exports = router;