// ## Globals
var pluginslug   = 'plugin-name';
var argv         = require('minimist')(process.argv.slice(2));
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var sass         = require('gulp-sass');
var plumber      = require('gulp-plumber');
var zip          = require('gulp-zip');
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var gulpif       = require('gulp-if');
var minifyCss    = require('gulp-minify-css');
var files        = [
                    '**/*.*',
                    '!node_modules/**',
                    '!bower_components/**',
                    '!includes/composer/**',
                    '!includes/autoload.php',
                    '!composer.lock',
                    '!composer.json',
                    '!src/**',
                    '!.DS_Store',
                    '!.git',
                    '!includes/skelet/.git',
                    '!includes/skelet/README.md',            
                    '!.gitignore',
                    '!.gitkeep',
                    '!.gitmodules',
                    '!.editorconfig',
                    '!.jshintrc',
                    '!gulpfile.js',
                    '!bower.json',
                    '!package.json',
                    '!sftpCache.json',
                    '!.ftppass',
                ];

// CLI options
var enabled = {
  min: argv.production,
};

// ### Admin Scripts
gulp.task('admin-scripts', ['jshint'], function() {
    gulp.src('src/admin/js/*.js')
        .pipe(plumber())
        .pipe(gulpif(enabled.min, uglify()))
        .pipe(concat(pluginslug + '-admin.js'))
        .pipe(gulp.dest('admin/js'));
});

// ### Admin Styles
gulp.task('admin-styles', function() {
    gulp.src('src/admin/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat(pluginslug + '-admin.css'))
        .pipe(gulpif(enabled.min, minifyCss()))
        .pipe(gulp.dest('admin/css'))
});

// ### Public Scripts
gulp.task('public-scripts', ['jshint'], function() {
    gulp.src('src/public/js/*.js')
        .pipe(plumber())
        .pipe(gulpif(enabled.min, uglify()))
        .pipe(concat(pluginslug + '-public.js'))
        .pipe(gulp.dest('public/js'));
});

// ### Public Styles
gulp.task('public-styles', function() {
    gulp.src('src/public/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat(pluginslug + '-public.css'))
        .pipe(gulpif(enabled.min, minifyCss()))
        .pipe(gulp.dest('public/css'))
});

// ### JSHint
gulp.task('jshint', function() {
  return gulp.src(['src/admin/js/*.js', 'src/public/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// ### Watch
gulp.task('watch', function() {
    gulp.watch('src/admin/js/*.js', ['admin-scripts']);
    gulp.watch('src/admin/scss/*.scss', ['admin-styles']);
    gulp.watch('src/public/js/*.js', ['public-scripts']);
    gulp.watch('src/public/scss/*.scss', ['public-styles']);
});

// ### Zip
gulp.task('zip', function () {
    return gulp.src(files)
        .pipe(zip(pluginslug + '.zip'))
        .pipe(gulp.dest('../production'));
});

// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', ['admin-scripts', 'admin-styles', 'public-scripts', 'public-styles']);

