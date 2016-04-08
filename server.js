import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
import request from 'request';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
import Clarifai from './clarifai_node.js';
var compiler = webpack(config);

import express from 'express';

var peers = [];

var app = express();
var token = 'YsXUX8HJw0RXM5JkwWEfrT9yJCa6sh';
var tags = {};
var knowntags = new Set();
var uploading = multer({
  dest: __dirname + '/uploads/',
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Clarifai.initAPI("pRH0rURL4ygLoq2egGvpqO9-f2DrCfAoum2QQJoi","X5pu0BEBKaVLTD_I9U4n1KAyu3rFVHRwk1H_rrFh");
// Clarifai._requestAccessToken();

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.post('/tag', uploading.single('displayImage'), function(req, res) {
  var newPath = req.file.path;
  console.log(req.file);
  fs.readFile(newPath, function(err, original_data){
    var base64Image = original_data.toString('base64');
    request.post('https://api.clarifai.com/v1/tag/', {'form':{'encoded_data': base64Image}, 'headers': {'Authorization': 'Bearer '+token}}, (err,httpResponse,bodystring) => {
      var body = JSON.parse(bodystring);
      console.log('body', body);
      console.log('code',body.results);
      if (body.status_code == 'OK') {
        var newtags = body.results[0].result.tag.classes;
        for (var tag of newtags) {
          if (tags[tag] !== undefined) {
            tags[tag].push(newPath);
          }
          else {
            tags[tag] = [newPath];
          }
          knowntags.add(tag);
        }
        for (var peer in peers) {
          request.post(peer + '/imageTagged', {body: {'tags': newtags}});
        }
        // console.log(httpResponse);
        console.log('tags: ',tags);
      }
    });
    res.status(200).send("OK");
});



});

app.get('/test',(req, res) => {
  console.log('got to test');
});

app.post('/imageTagged', (req, res) => {
  for (var tag of req.body.tags) {
    knowntags.add(tag);
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
