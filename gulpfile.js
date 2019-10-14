'use strict';

const AWS = require('aws-sdk');
const del = require('del');
const path = require('path');
let   gulp = require('gulp');
const cp = require("child_process");
const gutil     = require('gulp-util');
const sass      = require('gulp-sass');
const watch     = require("gulp-watch");
const exec      = require("gulp-exec");
const debug     = require('gulp-debug');
const concat    = require('gulp-concat');

// const miss      = require('mississippi');
// const uglyfly   = require('gulp-uglify');
// const critical = require('critical').stream;

const uglify = require('gulp-uglify-es').default;
const htmlmin   = require('gulp-htmlmin');
const cleanCSS  = require('gulp-clean-css');
const validator = require('gulp-html');
const sourcemaps= require('gulp-sourcemaps');
const awspublish= require('gulp-awspublish');
const htmlreplace=require('gulp-html-replace');
const parallelize=require("concurrent-transform");
// const hash       = require('gulp-hash-filename');
const babel = require('gulp-babel');

// var babel = require('babel/register');
// var webpack = require('webpack');
const webpack = require('webpack-stream');
const wbpk_config = require('./webpack.config.js');

var uglify_es = require('uglify-es'); 
var composer = require('gulp-uglify/composer');
var minify = composer(uglify_es, console);


// Make your own aws credential file see template below
const aws_login = require('./aws.js');
let config = require('./gulp.config.js');
const theme_include = require('./themes/phantom/source/_includes/inline-html.js');

//theme_include.inline.criticalCSS
const theme_prefix = './themes/phantom/';
/*  

$> cat ./aws.js
exports.test_creds = {
  "key"   : "***********",
  "secret": "**********************",
  "bucket": "test.example.com",
  "region": "us-east-1"
}; exports.prod_creds = {
  "key"   : "***********",
  "secret": "**********************",
  "bucket": "prod.example.com",
  "region": "us-east-1"
}; 
*/

/* command line recommendations:
> Include Drafts:    hexo g --drafts && gulp
> Regular Posts :    hexo g && gulp
*/




/* ***********************************
* ===================================
* Philosphy & Convetions
* ===================================
* Ideally gulp is only run after the hexo build.
* Thus the source of the assets should be the public hexo build
* 
*
* ===================================
* ToDo
* ===================================
* 1. gulp-html-replace 
*       use for inline css?
*       use for responsive images?
* 2. 
*
*
* ===================================
* 
* ===================================*
*
*
*
*
*
* ===================================
*  Manual Tasks
* ===================================
* 
*  Validate HTML = html
*  Merge Scripts = scripts
*  All of the above = check
*********************************** */

let search_xml =    ['./public/search.xml'];
let content_json =  ['./public/content.json'];
let top_pages =   ['./public/*.html',
                   './public/page/**/*.html'];
let index =   ['./public/index.html'];
let html =   ['./public/*.html', './public/**/*.html'];
let js =     ['./public/**/*.js'];
let css =    ['./public/**/*.css'];
let _sass =   ['./public/**/*.scss'];
let xml =    ['./public/**/*.xml',
              '!./public/search.xml'];
let json =   ['./public/**/*.json',
              '!./public/content.json'];
let fonts =  ['./public/**/*.ttf',
              './public/**/*.woff',
              './public/**/*.woff2',
              './public/**/*.eot',
              './public/**/*.bdf',
              './public/**/*.gsf',
              './public/**/*.psf',
              './public/**/*.otf',
              './public/**/*.pcf',
              './public/**/*.snf',
              './public/**/*.ttf',
              './public/**/*.ttc',
              './public/**/*.pfa',
              './public/**/*.pfb',
              './public/**/*.pfm',
              './public/**/*.afm'];
let media = [ './public/**/*.mp3',
              './public/**/*.mp4',
              './public/**/*.mov',
              './public/**/*.dmg',
              './public/**/*.pkg',
              './public/**/*.mpkg',
              './public/**/*.pass'];
let images = ['./public/**/*.png',
              './public/**/*.jpg',
              './public/**/*.jpeg',
              './public/**/*.webp',
              './public/**/*.gif',
              './public/**/*.svg',
              './public/**/*.svgz',
              './public/**/*.tiff',
              './public/**/*.tif',
             '!./public/images/raw/*'];

// negative paths are sticky and will be passed down
// `everything` + the exclusion of all the listed ones above.
let the_rest =   ['./public/**/*']; 
for( let arr of [ html,js,json,css,_sass,xml,fonts,media,images]){
  let arr2 = arr.map((val)=>{
    if( val.slice(0,1) === '.') return "!" + val;
    else return val;
  });
  the_rest = the_rest.concat(arr2);
};

const _5MIN = 300;
const _1HOUR = 3600;
const _1DAY = 86400;
const _7DAY =  7 * _1DAY;
const _14DAY =  2 * _7DAY;
const _1MONTH = 30 * _1DAY;

let image_headers =   {'Cache-Control': 'max-age='+ _1MONTH +', private'}
let font_headers =    {'Cache-Control': 'max-age='+  _14DAY +', private'} // private+maxage = browser caching & no CDN cache 
let _sass_headers =   {'Cache-Control': 'max-age='+   _7DAY +', private'} 
let css_headers =     {'Cache-Control': 'max-age='+   _7DAY +', public'}  // public+maxage = cache busting is required for CDN 
let js_headers =      {'Cache-Control': 'max-age='+   _7DAY +', public'} 
let media_headers =   {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=180'}
let xml_headers =     {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10'}
let the_rest_headers= {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10'}
let html_headers =    {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0'}


// create a new publisher using S3 options for reuse in the following gulp tasks
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 
const test_publisher = awspublish.create({
                          region: aws_login.test_creds.region,
                          // accessKeyId: aws_login.test_creds.key,
                          // secretAccessKey: aws_login.test_creds.secret,
                          // signatureVersion: 'v2',
                          credentials: new AWS.SharedIniFileCredentials({profile: 'personal_default'}),
                          params: 
                            {Bucket: aws_login.test_creds.bucket}
                        },{cacheFileName: 'cache4testpublishing'});

const prod_publisher = awspublish.create({
                          region: aws_login.prod_creds.region,
                          credentials: new AWS.SharedIniFileCredentials({profile: 'personal_default'}),
                          params: 
                            {Bucket: aws_login.prod_creds.bucket}
                        },{cacheFileName: 'cache4prodpublishing'});

gulp.task("images", function() {
  return watch("./rawimages/**/*.*")
        .pipe(exec('echo <%= file.path %>'))
        .pipe(exec.reporter({err: true, stderr: true, stdout: true}));
});


gulp.task('resize', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    customTemplatingThing: "test" // content passed to gutil.template()
  };
  return gulp.src('./**/**')
    .pipe(exec('git checkout <%= file.path %> <%= options.customTemplatingThing %>', options))
    .pipe(exec.reporter({err: true, stderr: true, stdout: true}));
});


gulp.task("resize", function() {
    // copy assets
    gulp.src("./_static/assets/**/*.*")
    .pipe(removeFiles());
    gulp.src("./assets/**/*.*")
    .pipe(gulp.dest("./_static/assets"));
});

gulp.task('webpack', function() {
  let entries = Object.keys(wbpk_config.entry).map(function(key) {
    return wbpk_config.entry[key];
  });

  return gulp.src(entries)
    .pipe(babel({presets: ['env']}))
    .pipe(webpack(wbpk_config))
    .pipe(gulp.dest('./public/build-assets/'))
});

gulp.task('html', function() {
  return gulp.src('./public/**/*.html')
  .pipe(validator())
  .pipe(debug({title: 'validator:'}))
  .pipe(gulp.dest('./validator-output'));
});

gulp.task('inline:css', function() {
  return gulp.src('./public/index.html')
    .pipe(debug({title: 'replace:'}))
    .pipe(htmlreplace({
        'css':{
            src: gulp.src(theme_prefix + '/source/css/inline.css')
                 .pipe(debug({title: 'replace:'})),
            tpl: '<style>%s</style>'
          },
    },{ keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('cat:js~before',()=>{
  return del(['./public/js/1.*',
              './public/js/6.*']);
});

gulp.task('clean:js', function () {
  return del(['./public/build-assets/js/*',
              './public/assets/js/*.js.map']);
});

gulp.task('cat:js', ['cat:js~before','clean:js',], function() {
  return gulp.src('./public/assets/js/*.js')
    .pipe(debug({title: 'catJs:'}))
    .pipe(minify())
    .pipe(concat('concat.min.js'))
    .pipe(gulp.dest('./public/build-assets/js/'));
});

gulp.task('clean:css', function () {
  return del([ './public/build-assets/css',]);
});

gulp.task('cat:css', ['clean:css'], function() {
  return gulp.src(['./public/sass/main.css',
                   './public/assets/css/SourceProSans-font.css',
                   './public/assets/css/fontawesome-all.css',
                   './public/css/mins/**/*.css'])
    // .pipe(debug({title: 'cat css:'}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(concat('concat.min.css'))
    .pipe(gulp.dest('./public/build-assets/css/'));
});

gulp.task('swap:js', function() {

  return gulp.src('./public/index.html')
    .pipe(debug({title: 'js swap:'}))
    .pipe(htmlreplace({
        'js': {src: [['/build-assets/js/concat.min.js',config.cachebust.js_bundle]],
               tpl: '<script type="text/javascript" src="%s%s"></script>'}
     },{ keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: false}))
    .pipe(gulp.dest('./public'));
});

gulp.task('swap:css', function() {
  return gulp.src('./public/index.html')
    .pipe(debug({title: 'css swap:'}))
    .pipe(htmlreplace({
        'css': {src: [['/build-assets/css/concat.min.css',config.cachebust.js_bundle]],
                tpl: '<link rel="stylesheet" type="text/css" href="%s%s"/>'}
    },{ keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: false}))
    .pipe(htmlreplace({
        'killcss': ''
    },{ keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: false}))
    .pipe(gulp.dest('./public'));
});


gulp.task('swap', function() {
  return gulp.src(html)
    // .pipe(debug({title: 'full swap:'}))
    .pipe(htmlreplace({
        'css': {src: [['/build-assets/css/concat.min.css',config.cachebust.js_bundle]],
                tpl: '<link rel="stylesheet" type="text/css" href="%s?v=%s"/>'}
     },{ keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: false}))
    .pipe(htmlreplace({'killcss': ''},
      { keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: false}))
    .pipe(htmlreplace({
        'js': {src: [['/build-assets/js/concat.min.js',config.cachebust.js_bundle]],
               tpl: '<script type="text/javascript" src="%s?v=%s"></script>'}
     },{ keepUnassigned: true,
        keepBlockTags: false,
        resolvePaths: false}))
    .pipe(gulp.dest('./public'));
});


gulp.task('js', ['clean:js','cat:js']);
gulp.task('css', ['clean:css','cat:css']);
gulp.task('clean', ['clean:css','clean:js']);
gulp.task('build', ['cat:js','cat:css','swap']); // 'webpack', 'clean'

gulp.task('jsmap', function() {
  gulp.src(js)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('sass', function () {
  return gulp.src(_sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('check', ['html','js','jsmap']);

// Generate & Inline Critical-path CSS
gulp.task('criticalCSS', function () {
    return gulp.src(top_pages)
        .pipe(critical({base: './public/', 
                        inline: true, 
                        css: ['./public/build-assets/css/concat.min.css']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(debug({title: 'criticalCSS:'}))
        .pipe(gulp.dest('./public/'));
});

/*****************************
* Start Test Publish Routines
*
* 
******************************/
gulp.task('test_publishIMG', function() {
  // define custom headers 
 return gulp.src(images)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(image_headers), 32))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishFonts', function() {
  return gulp.src(fonts)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(font_headers), 4))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishJS', ['build'], function() {
  return gulp.src(js)
    // .pipe(debug({title: 'test JS:'}))
    .pipe(minify())
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(js_headers), 8))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishCSS', ['build'], function() {
  return gulp.src(css)
    // .pipe(debug({title: 'unicorn:'}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(css_headers), 4))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishXML', function() {
  return gulp.src(xml)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(test_publisher.publish(xml_headers))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishHTML', ['build'], function() {
  return gulp.src(html)
    // .pipe(debug({title: 'unicorn:'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(html_headers),16))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publishMEDIA', function() {
  return gulp.src(media.concat(json))
    // .pipe(debug({title: 'testMEDIA: '}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(media_headers),8))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('test_publish', function() {
  return gulp.src(the_rest)
    // .pipe(debug({title: 'Rest: '}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(test_publisher.publish(the_rest_headers),8))
    .pipe(test_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publish', ['test_publishHTML',
                      'test_publishIMG',
                      'test_publishFonts',
                      'test_publishXML',
                      'test_publishMEDIA',
                      'test_publishCSS',
                      'test_publishJS',
                      'test_publish']);


gulp.task('default', ['build','publish'], ()=>{

  let url = "https://its.ericdmoore.com/"

  return cp.exec(`open ` + url, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if(stdout){
      console.log(`stdout: ${stdout}`);  
    }
    if(stderr){
      console.log(`stderr: ${stderr}`);  
    }
  });
});


/*****************************
* Start Prod Publish Routines
*
* 
******************************/

gulp.task('prod_publishIMG', function() {

  // define custom headers 
  // gzip files + set `Content-Encoding` file headers in s3
  return gulp.src(images)
    // YAY publish + GZIP == Test Env
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    // publisher will add Content-Length, Content-Type and headers specified above 
    // If not specified it will set x-amz-acl to public-read by default 
    .pipe(parallelize(prod_publisher.publish(image_headers), 25))
    // create a cache file to speed up consecutive uploads 
    .pipe(prod_publisher.cache())
     // print upload updates to console 
    .pipe(awspublish.reporter());
});


gulp.task('prod_publishFonts', function() {
  return gulp.src(fonts)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(font_headers), 5))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publishCSS', function() {
  return gulp.src(css)
    // .pipe(debug({title: 'unicorn:'}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(css_headers), 5))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publishXML', function() {
  return gulp.src(xml)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(prod_publisher.publish(xml_headers))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publishJS', function() {
  return gulp.src(js)
    .pipe(debug({title: 'js:'}))
    .pipe(minify())
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(js_headers), 10))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publishMEDIA', function() {
  return gulp.src(media.concat(json))
    // .pipe(debug({title: 'media:'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(media_headers),20))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publishHTML', function() {
  return gulp.src(html)
    // .pipe(debug({title: 'html:'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(html_headers),20))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('prod_publish', function() {
  return gulp.src(the_rest)
    // .pipe(debug({title: 'Rest: '}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(prod_publisher.publish(the_rest_headers),10))
    .pipe(prod_publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('production', ['js',
                         'prod_publishIMG',
                         'prod_publishCSS',
                         'prod_publishFonts',
                         'prod_publishXML',
                         'prod_publishJS',
                         'prod_publishMEDIA',
                         'prod_publishHTML',
                         'prod_publish']);

gulp.task('prod', ['production'],()=>{

    let url = "https://im.ericdmoore.com/"
    return cp.exec(`open ` + url, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if(stdout){
        console.log(`stdout: ${stdout}`);  
      }
      if(stderr){
        console.log(`stderr: ${stderr}`);  
      }
    });
});
