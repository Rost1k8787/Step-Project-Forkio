import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cssnano from 'gulp-cssnano'
import fileInclude from 'gulp-file-include'
import prettyHtml from 'gulp-pretty-html'
const sass = gulpSass(dartSass)
import autoprefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import imagemin from 'gulp-imagemin'
import pkg from 'gulp'
const { parallel, watch, series, src, dest } = pkg
import { deleteAsync } from 'del'
import browserSync from 'browser-sync'


const distPath = 'dist/'
const srcPath = 'src/'

const path = {
    build: {
        html: distPath,
        css: distPath + 'styles/',
        js: distPath + 'scripts/',
        images: distPath + 'images/',
        svg: distPath + 'images/',
    },
    src: {
        html: srcPath + '*.html',
        css: [srcPath + 'scss/*.scss', !srcPath + 'scss/_*.scss'],
        js: srcPath + 'scripts/*.js',
        images: srcPath + 'images/**/*.{jpg,png,gif,ico}',
        svg: srcPath + 'images/**/*.svg',
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'scss/**/*.scss',
        js: srcPath + 'scripts/**/*.js',
        images: srcPath + 'images/**/*.{jpg,png,gif,ico}',
        svg: srcPath + 'images/**/*.svg',
    },
    clean: './' + distPath,
}



function server() {
    browserSync.init({
        server: {
            baseDir: './' + distPath,
        },
    })
}

function clean() {
    return deleteAsync(path.clean)
}

function html() {
    return src(path.src.html, { base: srcPath })
        .pipe(fileInclude())
        .pipe(
            prettyHtml({
                indent_size: 4,
                indent_char: ' ',
                unformatted: [
                    'code',
                    'pre',
                    'em',
                    'strong',
                    'span',
                    'i',
                    'b',
                    'br',
                ],
            })
        )
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css, { base: srcPath + 'scss/' })
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function js() {
    return src(path.src.js, { base: srcPath + 'scripts/' })
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function images() {
    return src(path.src.images, { base: srcPath + 'images/' })
        .pipe(dest(path.build.images))
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(browserSync.stream())
}

function svg() {
    return src(path.src.svg, { base: srcPath + 'images/' })
        .pipe(dest(path.build.svg))
        .pipe(browserSync.stream())
}

function watchers() {
    watch([path.watch.html], html)
    watch([path.watch.css], css)
    watch([path.watch.js], js)
    watch([path.watch.images], images)
    watch([path.watch.svg], svg)
}

/* BUILD and DEV */

const build = () => {
    return series(clean, parallel(html, css, js, images, svg))
}

const dev = () => {
    return parallel(watchers, server)
}

gulp.task('default', series(build(), dev()))
