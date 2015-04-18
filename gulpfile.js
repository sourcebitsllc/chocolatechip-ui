// Import modules:
var gulp = require('gulp')
,   pkg = require('./package.json')
,   less = require('gulp-less')
,   rename = require('gulp-rename')
,   concat = require('gulp-concat')
,   gutils = require('gulp-util')
,   replace = require('gulp-replace')
,   minifyCSS = require('gulp-minify-css')
,   jshint = require('gulp-jshint')
,   uglify = require('gulp-uglify')
,   header = require('gulp-header')
,   footer = require('gulp-footer');

// Add Trailing slash to projectPath if not exists.
if (pkg.projectPath !== "")
  pkg.projectPath = pkg.projectPath.replace(/\/?$/, '/');

var whichLib = pkg.jquery.url;
var pkgVersion = pkg.version;
if (gutils.env.chocolatechipjs) whichLib = "../chui/chocolatechip-" + pkg.chocolatechipJSVersion + ".js";


// Define values for file headers:
var chui = ['ChUI-Android.css','ChUI-iOS.css','ChUI-Win.css','ChUI.js']
,   osNames = ['Android','iOS','Windows']
,   osTypes = ['android','ios','win'];

// Define header for ChUI files:
var chuiHeader = ['/*',
  '    pO\\',
  '   6  /\\',
  '     /OO\\',
  '    /OOOO\\',
  '   /OOOOOO\\',
  '  (OOOOOOOO)',
  '   \\:~==~:/',
  '',
  '<%= pkg.title %>',
  '<%= chuiName %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for minfied ChUI files:
var chuiHeaderMin = ['/*',
  '<%= pkg.title %>',
  '<%= chuiName %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for examples and demos:
var htmlHeader = ['<!DOCTYPE html>',
'<html lang="en"<%= langDir %>>',
'<head>',
'  <meta charset="utf-8">',
'  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
'  <meta name="apple-mobile-web-app-capable" content="yes">',
'  <meta name="mobile-web-app-capable" content="yes">',
'  <meta name="msapplication-tap-highlight" content="no">',
'  <title>ChocolateChip-UI <%= osName %></title>',
'  <link rel="stylesheet" href="../chui/chui-<%= osType %>-<%= pkg.version %>.css">',
'  <script src="<%= whichLib %>"></script>',
'  <script src="../chui/chui-<%= pkg.version %>.js"></script>'].join('\n') + '\n';

var less_for = function (os, idx) {
    gulp.src('src/themes/' + os + '/main.less')
      .pipe(less())
      .pipe(rename('chui-' + os + '-' + pkg.version + '.css'))
      .pipe(header(chuiHeader, { pkg : pkg, chuiName: chui[idx] }))
      .pipe(gulp.dest(pkg.projectPath + 'chui/'))
      .pipe(gulp.dest(pkg.projectPath + 'dist/'))
      .pipe(minifyCSS({}))
      .pipe(header(chuiHeaderMin, { pkg : pkg, chuiName: chui[idx] }))
      .pipe(rename('chui-' + os + '-' + pkg.version + '.min.css'))
      .pipe(gulp.dest(pkg.projectPath + 'chui/'))
      .pipe(gulp.dest(pkg.projectPath + 'dist/')); 
}

// Process, minify and output LESS:
gulp.task('less', function () {
  osTypes.forEach(less_for);
});

// Concat, minify and output JavaScript:
gulp.task('js', function () {
  var chuijs_start = [
    'window.CHUIJSLIB;',
    'if(window.jQuery) {',
    '  window.CHUIJSLIB = window.jQuery;',
    '} else if (window.$chocolatechipjs) {',
    '  window.CHUIJSLIB = window.$chocolatechipjs;',
    '}',
    '(function($) {\n'
  ].join('\n');
  var chuijs_end = '\n\}\)\(window\.CHUIJSLIB\);';

  gulp.src([
    'src/chui/utils.js', 
    'src/chui/events.js', 
    'src/chui/detectors.js', 
    'src/chui/browsers.js', 
    'src/chui/gestures.js', 
    'src/chui/desktop.js', 
    'src/chui/layout.js',
    'src/chui/navbar.js',
    'src/chui/pubsub.js', 
    'src/chui/navigation.js', 
    'src/chui/buttons.js', 
    'src/chui/blockui.js', 
    'src/chui/center.js', 
    'src/chui/busy.js', 
    'src/chui/popup.js', 
    'src/chui/popover.js', 
    'src/chui/segmented.js', 
    'src/chui/togglePanel.js', 
    'src/chui/paging.js', 
    'src/chui/editableList.js', 
    'src/chui/selectList.js', 
    'src/chui/sheet.js', 
    'src/chui/slideout.js', 
    'src/chui/stepper.js', 
    'src/chui/switch.js', 
    'src/chui/scroll.js', 
    'src/chui/tabbar.js', 
    'src/chui/templates.js', 
    'src/chui/search.js', 
    'src/chui/carousel.js',
    'src/chui/range.js',
    'src/chui/select.js',
    'src/chui/dataBinding.js'
  ])


    .pipe(replace(/^\(function\(\$\) \{\n  \"use strict\";/img, ''))
    .pipe(replace(/^\}\)\(window.\$\);/img, ''))
    .pipe(concat("chui-" + pkg.version + ".js"))
    .pipe(header(chuijs_start))
    .pipe(footer(chuijs_end))
    //.pipe(replace(/\}\)\(\);\n\}\)\(window.CHUIJSLIB\);/, '})(window.CHUIJSLIB);'))
    .pipe(header(chuiHeader, { pkg : pkg, chuiName: chui[3] }))
    .pipe(gulp.dest(pkg.projectPath + 'chui/'))
    .pipe(gulp.dest(pkg.projectPath + 'dist/'))
    .pipe(uglify())
    .pipe(header(chuiHeaderMin, { pkg : pkg, chuiName: chui[3] }))
    .pipe(rename("chui-" + pkg.version + ".min.js"))
    .pipe(gulp.dest(pkg.projectPath + 'chui/'))
    .pipe(gulp.dest(pkg.projectPath + 'dist/'));

    if (gutils.env.chocolatechipjs) {
      gulp.src(["src/chocolatechipjs/chocolatechip*.js"])
        .pipe(gulp.dest(pkg.projectPath + 'chui/'))
    }
});

// Copy out media:
gulp.task('copy', function() {
  gulp.src('src/images/**/*')
    .pipe(gulp.dest(pkg.projectPath + 'images/'));
  gulp.src('src/data/**/*')
    .pipe(gulp.dest(pkg.projectPath + 'data/'));
  gulp.src('src/pics/**/*')
    .pipe(gulp.dest(pkg.projectPath + 'pics/'));
  
});

// JSHint:
gulp.task('jshint', function() {
  gulp.src("chui-" + pkg.version + ".js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* 
   Define default task:
   To build, just enter gulp in terminal.
*/
gulp.task('default', ['less','js','jshint','examples']);

gulp.task('chui', ['less','js','jshint']);

// Generate only JavaScript
gulp.task('chuijs', ['js','jshint']);

// Generate all three themes - same as less following ChUI grunt conventions, easy docs
gulp.task('themes', ['less']);

// Generate only Android CSS
gulp.task('android', function () {
  less_for('android', osTypes.indexOf('android')); // 0 for position of element on chui var
});

// Generate only iOS CSS
gulp.task('ios', function () {
  less_for('ios', osTypes.indexOf('ios'));
});

// Generate only Windows CSS
gulp.task('win', function () {
  less_for('win', osTypes.indexOf('win'));
});


var generate_examples = function (os) {

  return (function() {

    var langDir = '';
    var rtl = gutils.env.dir === 'rtl';
    var dir = 'ltr';
    var prefix = '';

    var examples_for = function (os, idx) {

      gulp.src('src/' + prefix + 'examples/**/*')
        .pipe(header(htmlHeader, { pkg : pkg, osType : osTypes[idx], osName : osNames[idx], dir : prefix[dir], langDir : langDir, whichLib: whichLib }))
        .pipe(gulp.dest(pkg.projectPath + prefix + 'examples-' + os + '/'));
      gulp.src('src/' + prefix + 'demo/*.html')
        .pipe(header(htmlHeader, { pkg : pkg, osType : osTypes[idx], osName : osNames[idx], dir : prefix[dir], langDir : langDir, whichLib: whichLib }))
        .pipe(rename(prefix + 'demo-' + os + '.html'))
        .pipe(gulp.dest(pkg.projectPath + prefix + 'demo/'));

    };

    if (rtl) {
      prefix = 'rtl-';
      dir = 'rtl';
      langDir =  ' dir="rtl"';
      // Copy out rtl images:
      gulp.src('src/rtl-images/**/*')
        .pipe(gulp.dest(pkg.projectPath +'rtl-images/'));
      gulp.src('src/index.html')
        .pipe(gulp.dest(pkg.projectPath + 'rtl-examples-android/'))
        .pipe(gulp.dest(pkg.projectPath + 'rtl-examples-ios/'))
        .pipe(gulp.dest(pkg.projectPath + 'rtl-examples-win/'));
    } else {
      gulp.src('src/index.html')
        .pipe(gulp.dest(pkg.projectPath + 'examples-android/'))
        .pipe(gulp.dest(pkg.projectPath + 'examples-ios/'))
        .pipe(gulp.dest(pkg.projectPath + 'examples-win/'));
    }
    
    if (os === undefined) {
      osTypes.forEach(examples_for);
    } else {
      examples_for(os, osTypes.indexOf(os));
    }
      
  });
};

/*
To build all examples for Android, iOS and Windows Phone,
just run gulp.

To build the right-to-left examples for Android, iOS
and Windows Phone, run:
  gulp --dir rtl

To create OS-specific builds, run the following commands.
To create their right-to-left version, run the command followed by --dir rtl.
*/
// Generate only android example & demo
gulp.task('android_examples', ['chuijs','android','copy'], generate_examples('android'));

// Generate only ios example & demo
gulp.task('ios_examples', ['chuijs','ios','copy'], generate_examples('ios'));

// Generate only windows example & demo
gulp.task('win_examples', ['chuijs','win','copy'], generate_examples('win'));

// Create examples & demos (ltr or rtl):
gulp.task('examples', ['copy'], generate_examples());

// Watch LESS files and generate CSS:
gulp.task('watch:less', function() {
  gulp.watch('src/themes/android/*.less', ['android']);
  gulp.watch('src/themes/ios/*.less', ['ios']);
  gulp.watch('src/themes/win/*.less', ['win']);
});

// Watch JS file and generate ChUI JS:
gulp.task('watch:scripts', function() {
  gulp.watch('src/chui/*.js', ['chuijs']);
});

// Watch html files and generate  examples & demo files
gulp.task('watch:html', function() {
  var rtl = gutils.env.dir === 'rtl';
  if (rtl) { // build rtl on --dir rtl
    gulp.watch(['src/rtl-examples/*.html', 'src/rtl-demo/*.html'], ['examples']);
  } else {
    gulp.watch(['src/examples/*.html', 'src/demo/*.html'], ['examples']);
  }
});

//Watch All - html js & less
gulp.task('watch', ['watch:less', 'watch:scripts', 'watch:html']);
