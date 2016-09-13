var fs = require('fs')
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');




const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;


const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {

  resolve:{
    root: PATHS.app,
  },
  entry: path.resolve(PATHS.app, 'server.jsx'),

  output: {
    path: PATHS.build,
    publicPath: "/",
    filename: 'server.bundle.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: [
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css']//,
        // Include accepts either a path or an array of paths.
        //include: PATHS.app
      },
      // Set up jsx. This accepts js too thanks to RegExp
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],
        // Parse only app files! Without this it will go through entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app
      },
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.(png|jpg)$/,
        loaders: ['url-loader?limit=200'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      },
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.(svg)$/,
        loaders: ['file-loader'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      }
    ]
  }

}