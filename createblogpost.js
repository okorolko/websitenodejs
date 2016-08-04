var mongoose = require('./libs/mongoose');
var  async = require('async');
 blog = require('./models/blogs').Blog;

// методы для работы с базой

function saveData (data, res, next) {
  var blog = new mongoose.models.Blog({
    title: data.title,
    date: data.date,
    content: data.content
  });
  try {
    blog.save();
  } catch (e) {
    return next(err);
  }
  res.end('ok');
}

// function removeData (res, next) {
//   mongoose.connection.db.dropCollection('works', function(err, result) {
//     if (err) return next(err);
//   });
//   console.log('collection dropped')
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end('ok');
// }


exports.saveData = saveData;
// exports.removeData = removeData;

