/**
 * Module : webpack config
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 10:18:10
 */

var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var plugins = [],
	outputFile;

var	entryAry = {
		"kero-adapter": [__dirname + '/js/index.js'],
		"u": __dirname + '/js/u.js',
		"kero": [__dirname + '/js/kero.js']

	};

if(env === 'build') {
	plugins.push(new UglifyJsPlugin({
		minimize: true
	}));
	outputFile = '[name].min.js';
} else {
	outputFile = '[name].js';
}

var config = {
	entry: entryAry,
	// devtool: 'source-map',
	output: {
		path: __dirname + '/dist/js',
		filename: outputFile,
		//library: 'u',
		libraryTarget: 'var',
		umdNamedDefine: true
	},
	module: {
		loaders: [{
			test: /(\.jsx|\.js)$/,
			loader: 'babel',
			exclude: /(bower_components)/
		}, {
			test: /(\.jsx|\.js)$/,
			loader: "eslint-loader",
			exclude: /node_modules/
		}]
	},
	resolve: {
		root: path.resolve('./js'),
		extensions: ['', '.js']
	},
	plugins: plugins
};

module.exports = config;