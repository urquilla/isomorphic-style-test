const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');




const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;


const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

function getCSSLoader(){
  if(TARGET === 'start-dev' || !TARGET) {
    return {
        test: /\.css$/,
        loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ]
      };
  }else{
    return {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
    };
  }
}


const common= {  
  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given it's convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  resolve: {
    root: PATHS.app,
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    publicPath: "/",
    filename: 'bundle.js'
  },
  
  
 
  module: {
    loaders: [
      getCSSLoader(),
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
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
    })
  ] 
};

// Default configuration
if(TARGET === 'start-dev' || !TARGET) {
  module.exports = merge(common, {
      //devtool: 'cheap-module-source-map', enable me back if solved https://github.com/webpack/webpack/issues/2145
      devtool:'#inline-cheap-module-source-map',
      devServer: {
        contentBase: PATHS.build,
  
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
  
        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
  
        // Parse host and port from env so this is easy to customize.
        //
        // If you use Vagrant or Cloud9, set
        // host: process.env.HOST || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices unlike default
        // localhost
        host: '0.0.0.0',//process.env.HOST,
        port: process.env.PORT
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
          })
      ]
    });
}

if(TARGET === 'build-client') {
  module.exports = merge(common, {
      plugins: [
          new webpack.optimize.CommonsChunkPlugin('common.js'),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
              warnings: false
            }
          }),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
          }),
          new ExtractTextPlugin('app.css', {
            allChunks: true
          })
      ]
  });
}
