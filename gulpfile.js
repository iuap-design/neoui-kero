var gulp = require('gulp');

gulp.task('dist', function(){
	gulp.src('node_modules/neoui/dist/css/**')
		.pipe(gulp.dest('dist/css'));

	gulp.src('node_modules/neoui/dist/fonts/**')
		.pipe(gulp.dest('dist/fonts'));

	gulp.src('node_modules/neoui/dist/images/**')
		.pipe(gulp.dest('dist/images'));
});