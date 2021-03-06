import path from 'path';
import merge from 'webpack-merge';
import webpack from 'webpack';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  entry: ['webpack-hot-middleware/client', PATHS.app],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    publicPath: '/',
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [new RegExp(PATHS.app)]
      }
    ]
  },

  eslint: {
    configFile: '.eslintrc',
    emitError: true
  }
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      historyApiFallback: true,
      inline: true,
      progress: true,

      // uncomment to display only errors to reduce the amount of output
      // stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}
