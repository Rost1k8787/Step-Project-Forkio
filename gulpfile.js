const { src, dest, watch, lastRun, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const jsMinify = require('gulp-js-minify');

function styles(){
    return src('src/scss/**/*.scss', {since: lastRun('styles')})
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(concat('styles.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.reload({ stream: true }));
}

function scripts(){
    return src('src/scss/**/*.js', {since: lastRun('scripts')})
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(jsMinify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({ stream: true }));
}

function images(){
    return src('src/img/**/*.+(png|jpg|jpeg|webp|svg)')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(dest('dist/img'))
        .pipe(browserSync.reload({ stream: true }));
}

function serve() {
    return browserSync.init({
        server: {
            baseDir: ['./src/']
        },
        port: 9000,
        open: true
    });
}

function watching(){
    watch(['src/scss/**/*.scss'],styles)
    watch(['src/js/app.js'],scripts)
    watch(['src/*.html']).on('change', browserSync.reload)
    watch(['src/**/*+(png|jpg|jpeg|webp|svg)'],images)
}

exports.styles=styles;
exports.scripts=scripts;
exports.watching=watching;
exports.images=images;
exports.serve=serve;
exports.default = series( styles, scripts, images, parallel(serve, watching));

