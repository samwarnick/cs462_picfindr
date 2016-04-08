import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
import request from 'request';
import bodyParser from 'body-parser';
import fs from 'fs';
var compiler = webpack(config);

import express from 'express';

var peers = [];

var app = express();
var token = 'PLuoYVKO707urwc5TTKTNkR6j5SfFZ';
var tags = {};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.post('/tag', function(req, res) {
  console.log(req.body);
  console.log(req.files);
  console.log(req);
  fs.readFile(req.files.displayImage.path,  (err, data) => {
  // ...
  var newPath = __dirname + "/uploads/" + req.files.displayImage.name;
  fs.writeFile(newPath, data,(err) => {
    request.post('https://api.clarifai.com/v1/tag/', {form:{'encoded_data': newPath}, headers: {Authorization: 'Bearer'+token}}, (err,httpResponse,body) => {
      console.log('herein the thing');
      if (httpResponse.status_code === 'OK') {
        var newtags = httpResponse.results[0].result.tag.classes;
        for (var tag in newtags) {
          if (tags.tag !== undefined) {
            tags.tag.push(newPath);
          }
          else {
            tags.tag = [newPath];
          }
        }
        for (var peer in peers) {
          request.post(peer + '/imageTagged', {body: {'tags': newtags}});
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

app.post('/imageTagged', (req, res) => {
  for (var tag in req.body.tags) {

  }
});

app.post('/addPeer', (req, res) => {
  console.log('adding peer');
  var peer_url = req.body.url;
  peers.push(peer);
  res.end();
});

app.post('/peerAdded', (req, res) => {

});

app.listen(8080);
