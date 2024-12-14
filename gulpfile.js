const gulp = require('gulp');
const connect = require('gulp-connect');

// Copy HTML files
gulp.task('html', function() {
    return gulp.src('public/src/**/*.html')
        .pipe(connect.reload());
});

// Copy CSS files
gulp.task('css', function() {
    return gulp.src('public/src/**/*.css')
        .pipe(connect.reload());
});

// Copy JS files
gulp.task('js', function() {
    return gulp.src('public/src/**/*.js')
        .pipe(connect.reload());
});

// Watch for changes
gulp.task('watch', function() {
    gulp.watch('public/src/**/*.html', gulp.series('html'));
    gulp.watch('public/src/**/*.css', gulp.series('css'));
    gulp.watch('public/src/**/*.js', gulp.series('js'));
});

// Set up dev server
gulp.task('serve', function() {
    connect.server({
        root: 'public',
        livereload: true
    });
    gulp.watch('public/src/**/*.*', gulp.series('html', 'css', 'js'));
});

// Default task
gulp.task('default', gulp.series('serve'));