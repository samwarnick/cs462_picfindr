import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
import bodyParser from 'body-parser';
import request from 'request';

var compiler = webpack(config);

import express from 'express';
import http from 'http';
import socketio from 'socket.io';

var peers = [];
var sockets = [];

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var server = http.Server(app);
var io = socketio(server);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

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
  for (var peer in peers) {
    request.post(peer + '/imageRequested', {body: {'tag': tag}});
  }
  res.status(200).send({status: 'OK'});
});

app.post('/test', (req, res) => {
  for (var socket of sockets) {
    socket.emit('test', {test: 'test'});
  }
  res.end();
});

io.on('connection', function (socket) {
  sockets.push(socket);
  console.log('frontend is connected');
});

server.listen(8080);
