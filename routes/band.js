var router = require('express').Router(),
  service = require('../services/band');

// ===== query all ==================================================
router.get('/', function (req, res) {
  service.findAll(function (err, body) {
    if (err) {
      res.send(500, 'internal error while finding all bands (reason: ' + err + ')');
    } else {
      res.json(body);
    }
  });
});

module.exports = router;