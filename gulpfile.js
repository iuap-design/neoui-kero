var gulp = require('gulp');

gulp.task('dist', function(){
	gulp.src(['./node_modules/neoui/dist/css/**','./node_modules/neoui-grid/dist/css/**','./node_modules/neoui-tree/dist/css/**'])
		.pipe(gulp.dest('./dist/css'));

	gulp.src('./node_modules/neoui/dist/fonts/**')
		.pipe(gulp.dest('dist/fonts'));

	gulp.src('./node_modules/neoui/dist/images/**')
		.pipe(gulp.dest('./dist/images'));

	gulp.src(['./node_modules/neoui-grid/dist/js/**', './node_modules/neoui-tree/dist/js/**','./node_modules/neoui-polyfill/dist/**'])
		.pipe(gulp.dest('./dist/js'));

});