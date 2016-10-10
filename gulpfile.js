var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

/**
 * 需求：第三方包打进来，之后需要优化
 */
gulp.task('libui', function() {
	return gulp.src(['./dist/js/u.js','./node_modules/neoui/vendor/ui/*.js'])
		.pipe(concat('u.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(uglify())
		.pipe(rename('u.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('dist', ['libui'], function(){
	gulp.src(['./node_modules/neoui/dist/css/**','./node_modules/neoui-grid/dist/css/**','./node_modules/neoui-tree/dist/css/**'])
		.pipe(gulp.dest('./dist/css'));

	gulp.src('./node_modules/neoui/dist/fonts/**')
		.pipe(gulp.dest('dist/fonts'));

	gulp.src('./node_modules/neoui/dist/images/**')
		.pipe(gulp.dest('./dist/images'));

	gulp.src(['./node_modules/neoui-grid/dist/js/**', './node_modules/neoui-tree/dist/js/**','./node_modules/tinper-neoui-polyfill/dist/**'])
		.pipe(gulp.dest('./dist/js'));

});