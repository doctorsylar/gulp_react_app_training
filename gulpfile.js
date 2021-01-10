'use strict';

let gulp = require('gulp'),
	rigger = require('gulp-rigger'),
	// pug = require('gulp-pug'),

	sass = require('gulp-sass'),
	prefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),

    babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	webpackStream = require('webpack-stream'),
	webpack = require('webpack'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),

	svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),

	concat = require('gulp-concat'),
	rename = require('gulp-rename'),

	sourcemaps = require('gulp-sourcemaps'),
	watch = require('gulp-watch'),
	browserSync = require("browser-sync");

let path = {
	build: {
		html: 'build/',
		js: './js/',
		style: './',
		img: './img/',
		icons: './img/icons/',
		fonts: './fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		style: 'src/scss/style.scss',
		img: 'src/img/**/*.*',
		icons: 'src/img/icons/',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: './*.html',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
		icons: 'src/img/icons/*.svg'
	}
};

let reload = browserSync.reload;
let browserSyncConfig = {
	server: {
		baseDir: "./"
	},
	port: 3000,
	// proxy: 'localhost/eywa_land',
	open: false,
	tunnel: false
};

let isDev = false;

let webpackConfig = {
	output: {
		filename: 'script.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}
		]
	},
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'none',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ]
};

let minSuffix = '.min';
let sassOutputStyle = 'expanded';
let sassPrefixVersion = 'last 10 versions';
function htmlBuild () {
     return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
}
gulp.task('html:build', htmlBuild);

function styleBuild () {
    return gulp.src(path.src.style, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: sassOutputStyle
        }))
        .pipe(prefixer({
            cascade: false
        }))
		.pipe(cleanCss({
			level: 2
		}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(rename({
            suffix: minSuffix
        }))
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({stream: true}));
}
gulp.task('style:build', styleBuild);

function jsBuild () {
    return gulp.src('src/js/index.js', { allowEmpty: true })
        // .pipe(rigger())
        // .pipe(babel())
        // .pipe(uglify())
        // .pipe(concat(gulp.dest(path.build.js)))
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest(path.build.js))

        // .pipe(rename({
        // 	suffix: minSuffix
        // }))
        .pipe(reload({stream: true}));
}
gulp.task('js:build', jsBuild);

function iconsBuild () {
    return gulp.src(path.src.icons+'*.svg')
    // minify svg
    // .pipe(svgmin({
    // 	js2svg: {
    // 		pretty: true
    // 	}
    // }))
    // remove all fill and style declarations in out shapes
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[style]').removeAttr('style');
			$('[stroke]').removeAttr('stroke');
		},
		parserOptions: { xmlMode: true }
	}))
	// cheerio plugin create unnecessary string '>', so replace it.
	.pipe(replace('&gt;', '>'))
	// build svg sprite
	.pipe(svgSprite({
			mode: "symbols",
			preview: true,
			selector: "icon-%f",
			svg: {
				symbols: 'sprite.svg'
			}
		}
	))
	.pipe(gulp.dest(path.build.icons));
}
gulp.task('icons:build', iconsBuild);

function imageBuild () {
    return gulp.src(path.src.img)
    // .pipe(imagemin({
    // 	progressive: true,
    // 	svgoPlugins: [{removeViewBox: false}],
    // 	use: [pngquant()],
    // 	interlaced: true
    // }))
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true}));
}
gulp.task('image:build', imageBuild);

function fontsBuild () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
}
gulp.task('fonts:build', fontsBuild);

function gulpWatch () {
	gulp.watch(path.watch.html, htmlBuild);
	gulp.watch(path.watch.style, styleBuild);
	gulp.watch(path.watch.js, jsBuild);
    gulp.watch(path.watch.icons, iconsBuild);
    gulp.watch(path.watch.img, imageBuild);
    gulp.watch(path.watch.fonts, fontsBuild);
}
function gulpWebserver () {
    browserSync(browserSyncConfig);
}
gulp.task('webserver', gulpWebserver, gulpWatch);
gulp.task('build', gulp.series(htmlBuild, styleBuild, iconsBuild, imageBuild, fontsBuild, jsBuild));

exports.default = gulp.series('build', gulp.parallel(gulpWatch, gulpWebserver));
exports.server = gulp.parallel(gulpWatch, gulpWebserver);