var gulp = require('gulp');
var durandal = require('gulp-durandal');
var replace = require('gulp-replace');
var del = require('del');

gulp.task('clean', function(cb) {
	del(['build'], cb);
});

gulp.task('copy', ['clean'], function() {
	//fonts
	gulp.src('content/fonts/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('build/content/fonts'));

	//images
	gulp.src('content/images/**')
		.pipe(gulp.dest('build/content/images'));

	//styleheets
	gulp.src('content/*.min.css')
		.pipe(gulp.dest('build/content'));

	//scripts
	gulp.src('scripts/require.js')
		.pipe(gulp.dest('build/scripts'));

	//favicon
	gulp.src('icons/*.*')
		.pipe(gulp.dest('build'));

	//htmls
	//gulp.src('*.html')
	//	.pipe(gulp.dest('build'));
});

gulp.task('overwrite', ['clean', 'copy'], function(){
	var timestamp = Date.now();
	return gulp.src(['index.html'])
		.pipe(replace(/app\/main/g, 'app/main-built.js?t=' + timestamp))
		.pipe(replace(/site.css/g, 'site.min.css?t=' + timestamp))
		.pipe(gulp.dest('build'));
});
 
gulp.task('build', ['clean', 'copy', 'overwrite'], function(){
    return durandal({
			name: '../scripts/almond-custom',
			insertRequire: ['main'],
			baseDir: 'app',
			main: 'main.js',
			output: 'main-built.js',
			almond: true,
			minify: true,
			paths: {
				'text': '../scripts/text',
				'durandal': '../scripts/durandal',
				'plugins': '../scripts/durandal/plugins',
				'transitions': '../scripts/durandal/transitions',
				'jquery': '../scripts/jquery-2.1.1',
				'knockout': '../scripts/knockout-3.3.0',
				'knockout.validation': '../scripts/knockout.validation',
				'moment': '../scripts/moment'
			},
			rjsConfigAdapter : function(rjsConfig){
				rjsConfig.generateSourceMaps = false;
				rjsConfig.deps = ['text'];
				return rjsConfig;
			},
			inlineText: true,
			optimize: 'none',
			pragmas: {
				build: true
			}
		})
		.pipe(gulp.dest('build/app'));
});

gulp.task('default', ['clean', 'build']);