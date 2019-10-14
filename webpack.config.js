const path = require('path')

//yarn adds
const webpack = require('webpack') //to access built-in plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// the path(s) that should be cleaned
let pathsToClean = ['public/build-assets/js']

// the clean options to use
let cleanOptions = {
  // root:     '/full/webpack/root/path',
  // exclude:  ['shared.js'],
  verbose: true,
  dry: false
}

module.exports = {
  entry: {
    index: './themes/phantom/source/_babel/entry.babel.js',
    other: './themes/phantom/source/_babel/other.babel.js'
  },
  output: {
    path: path.resolve(__dirname, './public/build-assets/'),
    filename: '[name].bundle.js?v=[hash]'
  },

  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }
    ],
    loaders: [
      // {
      //   test: /\.js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       query: { presets: ['es2015'] },
      //       options: {
      //         presets: ['@babel/preset-env'],
      //         plugins: [require('@babel/plugin-proposal-object-rest-spread')]
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: false,
            minimize: true
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'bundle.css?v=[contenthash]' }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.optimize.UglifyJsPlugin({ ecma: 7, sourceMap: true })
    // new BundleAnalyzerPlugin()
  ]
}
