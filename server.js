import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
import request from 'request';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
var compiler = webpack(config);

import express from 'express';
import http from 'http';
import socketio from 'socket.io';

var peers = [];
var sockets = [];

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

var server = http.Server(app);
var io = socketio(server);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.post('/tag', uploading.single('displayImage'), function(req, res) {
  var newPath = req.file.path;
  fs.readFile(newPath, function(err, original_data){
    var base64Image = original_data.toString('base64');
    request.post('https://api.clarifai.com/v1/tag/', {'form':{'encoded_data': base64Image}, 'headers': {'Authorization': 'Bearer '+token}}, (err,httpResponse,bodystring) => {
      var body = JSON.parse(bodystring);
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
      }
    });
    res.status(200).send("OK");
});
});

app.post('/imageTagged', (req, res) => {
  for (var tag of req.body.tags) {
    knowntags.add(tag);
  }
});

app.post('/addPeer', (req, res) => {
  console.log('adding peer', req.body.url);
  var peer_url = 'http://' + req.body.url;
  peers.push(peer_url);
  res.status(200).send({status: 'OK'});
  request.post(peer_url + '/peerAdded');
});

app.post('/peerAdded', (req, res) => {
  var peer_url = req.protocol + '://' + req.get('host');
  peers.push(peer_url);
  res.status(200).send({status: 'OK'});
});

app.post('/requestImage', (req, res) => {
  var tag = req.body.tag;
  for (var peer of peers) {
    request.post(peer + '/imageRequested', {body: {'tag': tag, propnum: 2}});
  }
  res.status(200).send({status: 'OK'});
});

app.post('/imageRequested', (req,res) => {
  if (tags[req.body.tag]) {
    var rand = Math.random() * (tags[req.body.tag].length );
    var pic = tags[req.body.tag][rand];
    fs.readFile(pic, function(err, original_data){
      request.post(req.hostname + '/imageFound', {body: {'image': original_data.toString()}});
    });
  }
  else {
    if (req.body.propnum !== 0) {
      for (var peer of peers) {
        request.post(peer + '/imageRequested', {body: {'tag': req.body.tag, propnum: req.body.propnum - 1}});
      }
    }
  }
});

app.post('/imageFound', (req,res) => {
  //sends either a URL or something
});

app.post('/test', (req, res) => {
  for (var socket of sockets) {
    socket.emit('test', {test: 'test'});
  }
  res.end();
});

io.on('connection', function (socket) {
  sockets.push(socket);
  socket.on('disconnect', function () {
    io.emit('frontend disconnected');
  });
  console.log('frontend is connected');
});

server.listen(8080);
