'use strict';

//const imagemin = require('gulp-imagemin');

var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync').create();
del = require('del'),
    imagemin = require('gulp-imagemin'),

    clean = require('gulp-clean');


gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css')).pipe(browserSync.stream());
});

gulp.task('sass:watch', () => {
    gulp.watch('./css/*.scss', (done) => {
        gulp.series(['browser-sync', 'sass'])(done);
    });
});

gulp.task('browser-sync', gulp.series('sass', function () {
    var files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./css/*.scss", gulp.series('sass'));

}));

// Default task
gulp.task('default', gulp.series('browser-sync'));
//
gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('copyfonts', function () {
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function () {
    return gulp.src('img/*.{png,jpg,gif}')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean'], function () {
    gulp.start('copyfonts', 'imagemin');
});