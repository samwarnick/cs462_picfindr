import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
var compiler = webpack(config);

import express from 'express';

var peers = [];

var app = express();

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.post('/addPeer', (req, res) => {
  console.log('adding peer');
  var peer_url = req.body.url;
  peers.push(peer);
  res.end();
});

app.post('/peerAdded', (req, res) => {

});

app.listen(8080);
