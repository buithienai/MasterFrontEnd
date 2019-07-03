var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	fileinclude = require('gulp-file-include'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel'),
	wait = require('gulp-wait'),
	browserSync = require('browser-sync').create();

var paths = {
	src: './src',
	dist: './dist',

	bundles: './dist/bundles',
	bundlesCss: './dist/css',
	bundlesJs: './dist/js',
	min: './dist/min',
	fonts: './dist/fonts',
	img: './dist/images',
	vendor: './dist/lib',

	js: './src/js',
	scss: './src/scss',
	views: './src/views',
	temp: './src/temp',

	node: './node_modules'
};

gulp.task('vendor_css', function () {
	return gulp.src([

			// paths.node + '/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
			// paths.node + '/bootstrap-select/dist/css/bootstrap-select.css',

		])
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(paths.bundlesCss))
	// .pipe(rename('vendor.min.css'))
	// .pipe(cssnano({
	// 	zindex: false
	// }))
	// .pipe(gulp.dest(paths.min));
});

gulp.task('sass', function () {
	return gulp.src([
			paths.scss + '/*.scss'
		])
		.pipe(wait(1000))
		.pipe(sass({
			outputStyle: 'expanded',
			indentType: 'space',
			indentWidth: 2
		}))
		.pipe(autoprefixer({
			browsers: ['last 10 versions']
		}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest(paths.bundlesCss))
	// .pipe(rename('style.min.css'))
	// .pipe(cssnano({
	// 	zindex: false
	// }))
	// .pipe(gulp.dest(paths.min));
});

gulp.task('vendor_js', function () {
	return gulp.src([

			// paths.node + '/jquery-mousewheel.js/jquery.mousewheel.js',
		])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(paths.bundlesJs))
	// .pipe(rename('vendor.min.js'))
	// .pipe(uglify())
	// .pipe(gulp.dest(paths.min));
});

gulp.task('jshint', function () {
	return gulp.src(paths.js + '/*.js')
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter('default'));
});

gulp.task('babeljs', ['jshint'], function () {
	return gulp.src(paths.js + '/*.js')
		.pipe(babel())
		.pipe(gulp.dest(paths.temp + '/babeljs'));
});

gulp.task('js', ['babeljs'], function () {
	return gulp.src([
			paths.temp + '/babeljs/*.js'
		])
		// .pipe(concat('script.js'))
		.pipe(gulp.dest(paths.bundlesJs))
	// .pipe(rename('script.min.js'))
	// .pipe(uglify())
	// .pipe(gulp.dest(paths.min));
});

gulp.task('htmlinclude', function () {
	gulp.src([paths.views + '/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(paths.dist));
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var tasks = ['vendor_js', 'vendor_css', 'htmlinclude', 'jshint', 'babeljs', 'js', 'sass'];

var main = function () {

	// Run server
	browserSync.init({
		server: "./dist"
	});

	// Run registerd tasks
	gulp.watch([
		paths.views + '/*.html',
		paths.views + '/*/*.html',
		paths.views + '/*/*/*.html'
	], {
		cwd: './'
	}, ['htmlinclude']);

	gulp.watch([paths.js + '/*.js'], {
		cwd: './'
	}, ['js']);

	gulp.watch([
		paths.scss + '/*.scss',
		paths.scss + '/*/*.scss',
		paths.scss + '/*/*/*.scss'
	], {
		cwd: './'
	}, ['sass']);

	// Hot reload
	gulp.watch([
		paths.dist + '/*.html',
		paths.bundlesCss + '/*.css',
		paths.bundlesJs + '/*.js'
	]).on('change', browserSync.reload);

};

gulp.task('default', tasks, main);
gulp.task('watch', tasks, main);