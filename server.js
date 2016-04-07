import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel.js';
var compiler = webpack(config);

import express from 'express';

var app = express();
var token = 'PLuoYVKO707urwc5TTKTNkR6j5SfFZ';

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('build'));

app.get('/test', function(req, res) {
  console.log('got to test');
});

app.listen(8080);
