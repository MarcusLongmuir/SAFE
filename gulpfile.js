var gulp = require('gulp');
var gutil = require('gulp-util');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('uglify', function(){
    gulp.src([
        'src/jquery.history.js',
        'src/jquery.ajax_url.js',
        'src/jquery.tappable.js',
        'src/Page.js',
        'src/SiteFramework.js'
    ])
    .pipe(concat('safe.js'))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(concat('safe.min.js'))
    .pipe(gulp.dest('./'))
    .on('error', gutil.log);
})
gulp.task('default', function(){
    gulp.watch('src/*.js', ['uglify']);
});