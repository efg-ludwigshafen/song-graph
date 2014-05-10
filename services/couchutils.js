exports.withoutUnderscored = function (doc) {
  var key;
  doc.id = doc._id;
  for (key in doc) {
    if (doc.hasOwnProperty(key) && key.indexOf('_') === 0) {
      delete doc[key];
    }
  }
  return doc;
};