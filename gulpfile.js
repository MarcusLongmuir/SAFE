var gulp = require('gulp');
var gutil = require('gulp-util');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var gulpImports = require('gulp-imports');
var path = require('path');

gulp.task('js', function(){
    return gulp.src([
        'src/SiteFramework.js'
    ])
    .pipe(gulpImports())
    .pipe(concat('safe.js'))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(concat('safe.min.js'))
    .pipe(gulp.dest('./'))
    .on('error', gutil.log);
})
gulp.task('default', function(){
    gulp.watch('src/**.js', ['js']);
});