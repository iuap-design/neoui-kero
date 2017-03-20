var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var fs = require('fs');
var glob = require('glob');


gulp.task('webpack', function() {
    runWebpack('build');
    runWebpack('dev');
});

function runWebpack(mode) {
    var dir_js = path.resolve(__dirname, 'src');
    var dir_build = path.resolve(__dirname, 'dist');


    var data = fs.readFileSync('./package.json', 'utf8');
    var packageObj = JSON.parse(data);
    var headerStr = '';
    headerStr += packageObj.name + ' v' + packageObj.version + '\r\n';
    headerStr += packageObj.description + '\r\n';
    headerStr += 'author : ' + packageObj.author + '\r\n';
    headerStr += 'homepage : ' + packageObj.homepage + '\r\n';
    headerStr += 'bugs : ' + packageObj.bugs.url;
    var plugins = [new webpack.BannerPlugin(headerStr),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.NoErrorsPlugin()
    ]
    if (mode == 'build') {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            beautify: true
        }))
        plugins.push(new UglifyJsPlugin({
            minimize: true
        }));
    } else {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            beautify: true
        }))
    }
    var objArr = [];
    glob.sync(__dirname + '/src/*.js').forEach(function(name) {
        var n = name.slice(name.lastIndexOf('src/') + 4, name.length - 3);
        if (n == 'index')
            n = 'neoui-kero'
        var outputFile = ''
        if (mode == 'build') {
            outputFile = n + '.min.js';
        } else {
            outputFile = n + '.js';
        }
        var obj = {
            entry: name,
            output: {
                path: dir_build,
                filename: outputFile
            },
            devServer: {
                contentBase: dir_build,
            },
            module: {
                loaders: [{
                    loader: 'babel-loader',
                }]
            },
            plugins: plugins,
            stats: {
                colors: true
            },
            devtool: 'source-map',
        }
        webpack(obj, function(err, stats) {})
    });

}


gulp.task('default',['webpack']);
