'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const port = process.env.port || 5000;

gulp.task('jshint', () => {
	return gulp.src('./src/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter());
});

gulp.task('browserify', () => {
	return browserify({
		entries: ['./src/index.js'],
		debug: true
	})
	// .transform('babelify', {
	// 	presets: ['es2015']
	// })
	// .external(['jquery'])
	.bundle()
	.pipe(source('main.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({
		loadMaps: true
	}))
	.pipe(gulp.dest('./src/build/'))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./src/build/'));
});

gulp.task('connect', () => {
	connect.server({
		root: './',
		port: port,
		livereload: true
	});
});

gulp.task('js', () => {
	gulp.src('./src/build/**/*.js')
	.pipe(connect.reload());
});

gulp.task('watch', () => {
	gulp.watch('./src/build/**/*.js', ['js']);
	gulp.watch('./src/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);
gulp.task('serve', ['browserify', 'connect', 'watch']);
