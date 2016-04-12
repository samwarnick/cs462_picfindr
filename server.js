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

import os from'os';
var ifaces = os.networkInterfaces();

var me;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      me = iface.address + ":8080";
      console.log(iface.address);
    }
    ++alias;
  });
});

var port = 8080;
if (process.argv[2]) {
  port = parseInt(process.argv[2]);
}

var peers = [];
var clients = {};

var app = express();
var token = 'YsXUX8HJw0RXM5JkwWEfrT9yJCa6sh';
var tags = {};
var knowntags = new Set();
var uploading = multer({
  dest: __dirname + '/uploads/',
});

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
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

app.post('/tag', uploading.single('displayImage'), (req, res) => {
  var newPath = req.file.path;
  fs.readFile(newPath, (err, original_data) => {
    var base64Image = original_data.toString('base64');
    request.post('https://api.clarifai.com/v1/token/', {'form': {'client_id': "pRH0rURL4ygLoq2egGvpqO9-f2DrCfAoum2QQJoi", 'client_secret': "X5pu0BEBKaVLTD_I9U4n1KAyu3rFVHRwk1H_rrFh", 'grant_type': "client_credentials"}}, (err, httpResponse, bodystring) => {
          var body = JSON.parse(bodystring);
          token = body.access_token;
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
              clients[req.body.id].emit('new tags', {tags: [...knowntags]});
              for (var peer of peers) {
                request.post(peer + '/imageTagged', {'form': {'tags': newtags}});
              }
              res.status(200).send({status: 'OK'});
            } else {
              res.status(500).end();
            }
          });
        });
  });
});

app.post('/imageTagged', (req, res) => {
  console.log('someone added an image');
  var body = req.body;
  for (var tag of body.tags) {
    knowntags.add(tag);
  }
  for (let id of Object.keys(clients)) {
    clients[id].emit('new tags', {tags: [...knowntags]});
  }
  res.end();
});

app.post('/addPeer', (req, res) => {
  var peer_url = 'http://' + req.body.url;
  console.log(peer_url);
  peers.push(peer_url);
  res.status(200).send({status: 'OK'});
  request.post(peer_url + '/peerAdded', {'form': {'url': me}});
});

app.post('/peerAdded', (req, res) => {
  var peer_url = req.body.url;
  console.log(peer_url);
  peers.push(peer_url);
  res.status(200).send({status: 'OK'});
});

app.post('/requestImage', (req, res) => {
  console.log('I have sent the image request');
  var reqbody = req.body;
  var tag = reqbody.tag;
  var client_id = reqbody.socketId;
  if (tags[tag] === undefined) {
    for (var peer of peers) {
      request.post(peer + '/imageRequested', {'form': {'tag': tag, 'propnum': 2, 'client_id' : client_id, 'requester': me}});
    }
  } else {
    var rand = Math.floor(Math.random() * (tags[tag].length-1));
    var pic = tags[tag][rand];
    fs.readFile(pic,(err, original_data) => {
      clients[client_id].emit('imageFound' , { image: true, buffer: original_data.toString('base64') });
    });
  }
  res.status(200).send({status: 'OK'});
});

app.post('/imageRequested', (req,res) => {
  console.log('I got an imageRequested');
  var reqbody = req.body;
  var requester = req.protocol + '://' + req.get('host');
  var client_id = reqbody.socket_id;
  if (tags[reqbody.tag] !== null) {
    var rand = Math.floor(Math.random() * (tags[reqbody.tag].length - 1));
    var pic = tags[reqbody.tag][rand];
    fs.readFile(pic,(err, original_data) => {
      request.post(requester + '/imageFound', {'form': {'image': true, 'buffer': original_data.toString('base64'), 'client_id' : client_id}});
    });
  }
  else {
    if (reqbody.propnum > 0) {
      console.log('propnum', reqbody.propnum);
      for (var peer of peers) {
        var newpropnum = reqbody.propnum - 1;
        request.post(peer + '/imageRequested', {'form': {'tag': reqbody.tag, 'propnum': newpropnum, 'client_id' : client_id, 'requester': requester}});
      }
    }
  }
});

app.post('/imageFound', (req,res) => {
  console.log('I just got an image found posting');
  var reqbody = req.body;
  var image = reqbody.buffer;
  var client_id = reqbody.client_id;
  var socket = clients[client_id];
  socket.emit('imageFound' , { image: true, buffer: image });
});

app.post('/test', (req, res) => {
  socket.emit('test', {test: 'test'});
  res.end();
});

io.on('connection', (socket) => {
  clients[socket.id] = socket;
  socket.emit("connected", {socketId: socket.id, tags: [...knowntags]});
  socket.on('disconnect', () => {
    console.log('frontend disconnected');
  });
  console.log(socket.id, "connected");
});

server.listen(port, () => {
  console.log('listening on port', port);
});
