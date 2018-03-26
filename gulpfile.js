var gulp = require('gulp'),
minifycss = require('gulp-minify-css'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
jshint=require('gulp-jshint');
//Grammer Check
gulp.task('jshint', function () {
    return gulp.src([
        "static/app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js",
        "static/app/bower_components/jquery/dist/jquery.min.js",
        'static/app/config.js',
        "static/app/bower_components/angular/angular.min.js",
        "static/app/bower_components/angular-route/angular-route.min.js",
        "static/app/bower_components/angular-cookies/angular-cookies.js",
        "static/app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "static/app/bower_components/angular-sanitize/angular-sanitize.min.js",
        "static/app/bower_components/tv4/tv4.js",
        "static/app/bower_components/objectpath/lib/ObjectPath.js",
        "static/app/bower_components/angular-schema-form/dist/schema-form.min.js",
        "static/app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js",
        "static/app/bower_components/angular-loading-bar/build/loading-bar.min.js",
        "static/app/bower_components/angular-smart-table/dist/smart-table.min.js",
        "static/app/app.js",
        "static/app/components/version/version.js",
        "static/app/components/version/version-directive.js",
        "static/app/components/version/interpolate-filter.js",
        "static/app/global/global.js",
        "static/app/about/about.js",
        "static/app/crc-risk/crc-risk.js",
        "static/app/user/user.js",
        "static/app/crc-risk/risk-results.js",
        "static/app/test-results/test-results.js",
        "static/app/welcome/welcome.js"
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// Compress Css file
gulp.task('minifycss', function() {
    return gulp.src([
    'static/app/bower_components/html5-boilerplate/dist/css/normalize.css',
    'static/app/bower_components/html5-boilerplate/dist/css/main.css',
    'static/app/bower_components/bootstrap/dist/css/bootstrap.min.css',
    'static/app/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
    'static/app/bower_components/angular-loading-bar/build/loading-bar.min.css',
    'static/app/css/app.css',
    'static/app/css/typesettings-1.1-min.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('css')) 
    .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('Css'));
});
//Compress JS
gulp.task('minifyjs', function() {
    return gulp.src([
        "static/app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js",
        "static/app/bower_components/jquery/dist/jquery.min.js",
        'static/app/config.js',
        "static/app/bower_components/angular/angular.min.js",
        "static/app/bower_components/angular-route/angular-route.min.js",
        "static/app/bower_components/angular-cookies/angular-cookies.js",
        "static/app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "static/app/bower_components/angular-sanitize/angular-sanitize.min.js",
        "static/app/bower_components/tv4/tv4.js",
        "static/app/bower_components/objectpath/lib/ObjectPath.js",
        "static/app/bower_components/angular-schema-form/dist/schema-form.min.js",
        "static/app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js",
        "static/app/bower_components/angular-loading-bar/build/loading-bar.min.js",
        "static/app/bower_components/angular-smart-table/dist/smart-table.min.js",
        "static/app/app.js",
        "static/app/components/version/version.js",
        "static/app/components/version/version-directive.js",
        "static/app/components/version/interpolate-filter.js",
        "static/app/global/global.js",
        "static/app/about/about.js",
        "static/app/crc-risk/crc-risk.js",
        "static/app/user/user.js",
        "static/app/crc-risk/risk-results.js",
        "static/app/test-results/test-results.js",
        "static/app/welcome/welcome.js"
    ])
        .pipe(concat('main.js'))    
        .pipe(gulp.dest('js'))       
        .pipe(rename({suffix: '.min'}))   
        .pipe(uglify())    
        .pipe(gulp.dest('Js'));  
});
　　//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
gulp.task('default',['jshint'],function() {
    gulp.start('minifycss','minifyjs'); 
　　});

