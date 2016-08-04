var Work = require('../models/works').Work;

// вывод всех данных из коллекции базы

module.exports = function(req, res, next) {
  Work.find({}, function(err, notes) {
    if (err) return next(err);
    req.notes = res.locals.notes = notes;
    next();
  });
};

