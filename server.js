import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
import request from 'request';
var compiler = webpack(config);

import express from 'express';

var app = express();
var token = 'PLuoYVKO707urwc5TTKTNkR6j5SfFZ';
var tags = {};

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.post('/tag', function(req, res) {
  fs.readFile(req.files.displayImage.path,  (err, data) => {
  // ...
  var newPath = __dirname + "/uploads/" + req.files.displayImage.name;
  fs.writeFile(newPath, data,(err) => {
    request.post('https://api.clarifai.com/v1/tag/', {form:{'encoded_data': newPath}}, {headers: {Authorization: 'Bearer'+token}}, (err,httpResponse,body) => {
      console.log('herein the thing');
      if (httpResponse.status_code === 'OK') {
        var tags = httpResponse.results[0].result.tag.classes;
        for (var tag in tags) {
          if (tags.tag !== undefined) {
            tags.tag.push(newPath);
          }
          else {
            tags.tag = [newPath];
          }
        }
        console.log(httpResponse);
        console.log(tags);
      }
    });
    res.redirect("/");
  });
});
});

app.get('/test',(req, res) => {
  console.log('got to test');
});

app.listen(8080);
