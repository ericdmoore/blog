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

const uglify =    require('gulp-uglify-es').default;
const htmlmin   = require('gulp-htmlmin');
const cleanCSS  = require('gulp-clean-css');
const validator = require('gulp-html');
const sourcemaps= require('gulp-sourcemaps');
const awspublish= require('gulp-awspublish');
const htmlreplace=require('gulp-html-replace');
const parallelize=require('concurrent-transform');
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
const aws_envs = require('./aws-envs.js').envs;
let config = require('./gulp.config.js');

//theme_include.inline.criticalCSS
// const theme_prefix = './themes/existing-theme/';

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
let top_pages =     ['./public/*.html',
                     './public/**/*.html'];
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

const _5MIN  =  300;
const _1HOUR =  3600;
const _1DAY  =  24 * _1HOUR;
const _7DAY  =  7  * _1DAY;
const _14DAY =  2  * _7DAY;
const _1MONTH = 30 * _1DAY;
                                                                          // previous used value
let image_headers =   {'Cache-Control': 'max-age='+ _1MONTH +', private'}  // 1Month
let font_headers =    {'Cache-Control': 'max-age='+  _14DAY +', private'}  // 14Day // private+maxage = browser caching & no CDN cache 
let _sass_headers =   {'Cache-Control': 'max-age='+   _7DAY +', private'}  // 7Day
let css_headers =     {'Cache-Control': 'max-age='+   _14DAY +', private'}  // 14Day
let js_headers =      {'Cache-Control': 'max-age='+   _14DAY +', private'}  // 14Day
let media_headers =   {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=180'}
let xml_headers =     {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10'}
let the_rest_headers= {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10'}
let html_headers =    {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0'}


// create a new publisher using S3 options for reuse in the following gulp tasks
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 

// accessKeyId: aws_login.test_creds.key,
// secretAccessKey: aws_login.test_creds.secret,
// signatureVersion: 'v2',


const cliArgs = (argList => {
  let arg = {}, a, opt, thisOpt, curOpt;
  argList.forEach((v,i,a)=>{
    // a is the counter
    // iterate through the argList and trim up the element
    // assign to thisOpt
    thisOpt = argList[i].trim();
    
    //  remove 2xhypens from thisOpt
    //  assign to opt
    opt = thisOpt.replace(/^\-+/, '');

    // if replacement had no effect
    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;

    }
    else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  })
  return arg;

})(process.argv);


/* See the aws-envs file
   it has a publiher per env
   it has a url per env which is for the auto opening of the freshly deployed site.
   
   It also supports an alias structure via the `"alias":{redirectTo: <OtherConfigedEnv>}` syntax
   To test the setup, use `gulp -T` to check for gross-syntax errors 
   Try `gulp print` to see the defaults
   Try `gulp print --env blue` to see the param for the selected/configured env
   Try `gulp print --env blahblahblah` to see that you will get an error for unconfigured env
*/

const [publisherSelected, inputEnv] = ((param) =>{
  // cli got input of --env ____ AND the ____ was in the config file
  if('env' in cliArgs){
    
    if(!aws_envs[cliArgs.env]){
      throw Error(`The ENV requested (--env ${cliArgs.env}) could not be found. Check config file for alternate spellings or aliases` )
    }
    if ('redirectTo' in aws_envs[cliArgs.env]){
      const redir = aws_envs[cliArgs.env].redirectTo
      return [ aws_envs[redir].publisher, redir ];
    }else{
      return [aws_envs[cliArgs.env].publisher, cliArgs.env];   
    }
    
  } 
    else if('test' in cliArgs){
      return [ aws_envs['test'].publisher, "test"]; 
  } 

  else if('prod' in cliArgs || 'production' in cliArgs){
      return [ aws_envs['prod'].publisher, 'prod' ];
  } 

  else {
      //supports absolute default = test
      return [ aws_envs['test'].publisher, 'test' ];
  }
})(cliArgs);


gulp.task('print', (done)=>{
    console.log({cliArgs});
    console.log({inputEnv});
    console.log({AwsCache : publisherSelected._cacheFile});
    done();
});

gulp.task("images", function(done) {
  return watch("./rawimages/**/*.*")
        .pipe(exec('echo 1.<%= file.path %> 2.<%-file.cwd %> 3.<%- file.base %> 4. <%- file.history %>'))
        .pipe(exec.reporter({err: true, stderr: true, stdout: true}))
        // .pipe(miss.through.obj((data, enc, cb)=>{
        //   console.log({data});cb(data);
        // }))
});


gulp.task('precopy:js', function(done) {
  return gulp.src(['./node_modules/marked/lib/*.js'])
    .pipe(debug({title: 'precopy:js :: '}))
    .pipe(minify())
    .pipe(gulp.dest('./public/assets/js/'));
})

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


// gulp.task("resize", function() {
//     // copy assets
//    return gulp.src("./_static/assets/**/*.*")
//     .pipe(removeFiles());
//     // gulp.src("./assets/**/*.*")
//     // .pipe(gulp.dest("./_static/assets"));
// });

gulp.task('example', () => {
  return gulp.src('./source/images/**/*.jpg', {read: false})
  .pipe()
})

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

// old: gulp.task(name, deps, func) 
// new: gulp.task(name, gulp.series|parallel}(deps, func))

gulp.task('clean:js', function () {
  return del(['./public/build-assets/js/*',
              './public/assets/js/*.js.map']);
});

gulp.task('clean:css', function (done) {
  return del(['./public/build-assets/css']);
});

gulp.task('cat:js', gulp.series('clean:js', 'precopy:js', function() {
  return gulp.src(js)
    .pipe(debug({title: 'catJs:'}))
    .pipe(minify())
    .pipe(concat('concat.min.js'))
    .pipe(gulp.dest('./public/build-assets/js/'));
}));

gulp.task('cat:css', gulp.series('clean:css', function() {
  return gulp.src(['./public/assets/sass/bulma.css'])
    .pipe(debug({title: 'catCss:'}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(concat('concat.min.css'))
    .pipe(gulp.dest('./public/build-assets/css/'));
}));

gulp.task('swap:js', function() {
  return gulp.src('./public/index.html')
    .pipe(debug({title: 'js swap:'}))
    .pipe(htmlreplace({
        'js': {src: [['/build-assets/js/concat.min.js',config.hash({input:'/build-assets/js/concat.min.js'})]],
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
    .pipe(debug({title: 'Full Swap:'}))
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


gulp.task('js', gulp.series('cat:js', (done)=>done()));
gulp.task('css', gulp.series('cat:css', (done)=>done()));
gulp.task('clean', gulp.series('clean:css','clean:js', (done)=>done()));
gulp.task('build', gulp.parallel('print','cat:js','cat:css','swap', (done)=>done() )); //'webpack']); //'clean'
gulp.task('check', gulp.series('html', (done)=>done()));

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
gulp.task('publishIMG', function() {
  return gulp.src(images)
    .pipe(debug({title: 'Imgs:'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(image_headers), 32))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publishFonts', function() {
  return gulp.src(fonts)
    .pipe(debug({title: 'Fonts:'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(font_headers), 4))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publishJS', gulp.series('js', function() {
  return gulp.src(js)
    // .pipe(debug({title: 'test JS:'}))
    .pipe(minify())
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(js_headers), 8))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
}));

gulp.task('publishCSS', gulp.series('css', function() {
  return gulp.src(css)
    // .pipe(debug({title: 'unicorn:'}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(css_headers), 4))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
}));

gulp.task('publishXML', function() {
  return gulp.src(xml)
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(publisherSelected.publish(xml_headers))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publishHTML', gulp.series('swap', function() {
  return gulp.src(html)
    // .pipe(debug({title: 'unicorn:'}))
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(html_headers),16))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
}));

gulp.task('publishMEDIA', function() {
  return gulp.src(media.concat(json))
    // .pipe(debug({title: 'testMEDIA: '}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(media_headers),8))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publishDaRest', function() {
  return gulp.src(the_rest)
    // .pipe(debug({title: 'Rest: '}))
    .pipe(awspublish.gzip({skipGrowingFiles:true}))
    .pipe(parallelize(publisherSelected.publish(the_rest_headers),8))
    .pipe(publisherSelected.cache())
    .pipe(awspublish.reporter());
});

gulp.task('publish', gulp.parallel(
                          'print',
                          'publishHTML',
                          'publishIMG',
                          'publishFonts',
                          'publishXML',
                          'publishMEDIA',
                          'publishCSS',
                          'publishJS',
                          'publishDaRest')
            );


gulp.task('default', gulp.series('print', 'build', 'publish', ()=>{

  let url = aws_envs[inputEnv].url
  
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
}));
