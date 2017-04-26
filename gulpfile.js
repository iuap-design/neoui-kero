var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var fs = require('fs');
var glob = require('glob');
var rollupEach = require('gulp-rollup-each');
var resolve = require("rollup-plugin-node-resolve");


gulp.task('webpack', function() {
    runWebpack('build');
    runWebpack('dev');
});

function runWebpack(mode) {
    var dir_js = path.resolve(__dirname, 'src');



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
        var dir_build = path.resolve(__dirname, 'dist/component');
        var n = name.slice(name.lastIndexOf('src/') + 4, name.length - 3);
        if (n == 'index'){
            n = 'neoui-kero'
            dir_build = path.resolve(__dirname, 'dist');
        }

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


// gulp.task('default',['webpack']);

gulp.task('default',['rollup']);

/**
 * 使用gulp的rollup插件来对单个组件进行编译
 * @type {String}
 */
gulp.task('rollup', () => {
    return gulp.src([
            'src/*.js',
            '!src/index.js' // exclude modules
        ])
        .pipe(rollupEach({
            // rollup.rollup( options )
            plugins: [
                resolve(),
            ]
        }, {
            // bundle.generate( options )
            format: 'iife',
            moduleName: "bar"
        }))
        .pipe(gulp.dest('dist/component'))
})
