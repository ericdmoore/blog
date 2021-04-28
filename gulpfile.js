'use strict'

// const AWS = require('aws-sdk')
const del = require('del')
// const path = require('path')
const gulp = require('gulp')
const cp = require('child_process')
const gutil = require('gulp-util')
const sass = require('gulp-sass')

const exec = require('gulp-exec')
const debug = require('gulp-debug')
const concat = require('gulp-concat')
const getopts = require('getopts')

const uglify = require('gulp-uglify-es').default

const cleanCSS = require('gulp-clean-css')
const validator = require('gulp-html')
const sourcemaps = require('gulp-sourcemaps')
const awspublish = require('gulp-awspublish')
const htmlreplace = require('gulp-html-replace')
const parallelize = require('concurrent-transform')

var webpack = require('webpack')
const wbpk_config = require('./webpack.config.js')

const uglify_es = require('uglify-es')
const composer = require('gulp-uglify/composer')
const minify = composer(uglify_es, console)

// const watch     = require("gulp-watch");
// const miss      = require('mississippi');
// const uglyfly   = require('gulp-uglify');
// const critical = require('critical').stream;
// const htmlmin   = require('gulp-htmlmin');
// const hash       = require('gulp-hash-filename');
// const babel = require('gulp-babel');
// var babel = require('babel/register');

// Make your own aws credential file see template below
const awsEnvs = require('./aws-envs.js')
const gulpConfig = require('./gulp.config.js')
const theme_include = require('./themes/phantom/source/_includes/inline-html.js')

//theme_include.inline.criticalCSS
const theme_prefix = './themes/phantom/'

const search_xml = ['./public/search.xml']
const content_json = ['./public/content.json']
const top_pages = ['./public/*.html', './public/page/**/*.html']
const index = ['./public/index.html']
const html = ['./public/*.html', './public/**/*.html']
const js = ['./public/**/*.js']
const css = ['./public/**/*.css']
const _sass = ['./public/**/*.scss']
const xml = ['./public/**/*.xml', '!./public/search.xml']
const json = ['./public/**/*.json', '!./public/content.json']
const fonts = [
  './public/**/*.ttf',
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
  './public/**/*.afm'
]
let media = [
  './public/**/*.mp3',
  './public/**/*.mp4',
  './public/**/*.mov',
  './public/**/*.dmg',
  './public/**/*.pkg',
  './public/**/*.mpkg',
  './public/**/*.pass'
]
let images = [
  './public/**/*.png',
  './public/**/*.jpg',
  './public/**/*.jpeg',
  './public/**/*.webp',
  './public/**/*.gif',
  './public/**/*.svg',
  './public/**/*.svgz',
  './public/**/*.tiff',
  './public/**/*.tif',
  '!./public/images/raw/*'
]

// negative paths are sticky and will be passed down
// `everything` + the exclusion of all the listed ones above.
let the_rest = [
  ...html,
  ...js,
  ...json,
  ...css,
  ...xml,
  ...fonts,
  ...media,
  ...images,
  ..._sass
].reduce((p, val) => [...p, val.startsWith('.') ? `!${val}` : val], [
  './public/**/*'
])

const _5MIN = 300
const _1HOUR = 3600
const _1DAY = 86400
const _7DAY = 7 * _1DAY
const _14DAY = 2 * _7DAY
const _1MONTH = 30 * _1DAY

let HSTS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}
let image_headers = {
  'Cache-Control': 'max-age=' + _1MONTH + ', private',
  ...HSTS
}
let font_headers = {
  'Cache-Control': 'max-age=' + _14DAY + ', private',
  ...HSTS
}
let _sass_headers = {
  'Cache-Control': 'max-age=' + _7DAY + ', private',
  ...HSTS
}
let css_headers = { 'Cache-Control': 'max-age=' + _7DAY + ', public', ...HSTS }
let js_headers = { 'Cache-Control': 'max-age=' + _7DAY + ', public', ...HSTS }
let media_headers = {
  'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=180',
  ...HSTS
}
let xml_headers = {
  'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10',
  ...HSTS
}
let the_rest_headers = {
  'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=10',
  ...HSTS
}
let html_headers = {
  'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0',
  ...HSTS
}

/**
 * Parse CLI and setup the Publiher Env
 */
// parse CLI
const options = getopts(process.argv.slice(2), {
  alias: {
    environment: 'env'
  },
  default: {
    env: 'test',
    mode: 'development'
  },
  string: ['env', 'mode']
})

// redirect if needed
if (
  typeof awsEnvs[options.env] !== 'string' &&
  'redirectTo' in awsEnvs[options.env]
) {
  options.env = awsEnvs[options.env].redirectTo
}

// validate
if (!Object.keys(awsEnvs).includes(options.env)) {
  throw new Error('Plese use a listed env name from the aws-envs.js file')
}
const publiser = awsEnvs[options.env].publiser

// create a new publisher using S3 options for reuse in the following gulp tasks
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property

gulp.task('print', done => {
  console.log({ options })
  done(null, options)
})

gulp.task('webpack', done => {
  const compiler = webpack(wbpk_config({ mode: '', env: {} }))
  const s = compiler.run((err, stats) => {
    console.log({ stats })
    done(null, stats)
  })
})

gulp.task('images', function() {
  return watch('./rawimages/**/*.*')
    .pipe(exec('echo <%= file.path %>'))
    .pipe(exec.reporter({ err: true, stderr: true, stdout: true }))
})

gulp.task('resize2', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    customTemplatingThing: 'test' // content passed to gutil.template()
  }
  return gulp
    .src('./**/**')
    .pipe(
      exec(
        'git checkout <%= file.path %> <%= options.customTemplatingThing %>',
        options
      )
    )
    .pipe(exec.reporter({ err: true, stderr: true, stdout: true }))
})

gulp.task('resize', function() {
  // copy assets
  gulp.src('./_static/assets/**/*.*').pipe(removeFiles())
  gulp.src('./assets/**/*.*').pipe(gulp.dest('./_static/assets'))
})

gulp.task('html', function() {
  return gulp
    .src('./public/**/*.html')
    .pipe(validator())
    .pipe(debug({ title: 'validator:' }))
    .pipe(gulp.dest('./validator-output'))
})

gulp.task('inline:css', function() {
  return gulp
    .src('./public/index.html')
    .pipe(debug({ title: 'replace:' }))
    .pipe(
      htmlreplace(
        {
          css: {
            src: gulp
              .src(theme_prefix + '/source/css/inline.css')
              .pipe(debug({ title: 'replace:' })),
            tpl: '<style>%s</style>'
          }
        },
        { keepUnassigned: true, keepBlockTags: true, resolvePaths: true }
      )
    )
    .pipe(gulp.dest('./public'))
})

gulp.task('cat:js~before', () => {
  return del(['./public/js/1.*', './public/js/6.*'])
})

gulp.task('clean:js', function() {
  return del(['./public/build-assets/js/*', './public/assets/js/*.js.map'])
})

gulp.task(
  'cat:js',
  gulp.series(['cat:js~before', 'clean:js'], () => {
    return gulp
      .src('./public/assets/js/*.js')
      .pipe(debug({ title: 'catJs:' }))
      .pipe(minify())
      .pipe(concat('concat.min.js'))
      .pipe(gulp.dest('./public/build-assets/js/'))
  })
)

gulp.task('clean:css', function() {
  return del(['./public/build-assets/css'])
})

gulp.task(
  'cat:css',
  gulp.series(['clean:css'], () => {
    return (
      gulp
        .src([
          './public/sass/main.css',
          './public/assets/css/SourceProSans-font.css',
          './public/assets/css/fontawesome-all.css',
          './public/css/mins/**/*.css'
        ])
        // .pipe(debug({title: 'cat css:'}))
        .pipe(cleanCSS({ compatibility: '*' }))
        .pipe(concat('concat.min.css'))
        .pipe(gulp.dest('./public/build-assets/css/'))
    )
  })
)

gulp.task('swap:js', function() {
  return gulp
    .src('./public/index.html')
    .pipe(debug({ title: 'js swap:' }))
    .pipe(
      htmlreplace(
        {
          js: {
            src: [
              ['/build-assets/js/concat.min.js', gulpConfig.cachebust.js_bundle]
            ],
            tpl: '<script type="text/javascript" src="%s%s"></script>'
          }
        },
        { keepUnassigned: true, keepBlockTags: true, resolvePaths: false }
      )
    )
    .pipe(gulp.dest('./public'))
})

gulp.task('swap:css', function() {
  return gulp
    .src('./public/index.html')
    .pipe(debug({ title: 'css swap:' }))
    .pipe(
      htmlreplace(
        {
          css: {
            src: [
              [
                '/build-assets/css/concat.min.css',
                gulpConfig.cachebust.js_bundle
              ]
            ],
            tpl: '<link rel="stylesheet" type="text/css" href="%s%s"/>'
          }
        },
        { keepUnassigned: true, keepBlockTags: true, resolvePaths: false }
      )
    )
    .pipe(
      htmlreplace(
        {
          killcss: ''
        },
        { keepUnassigned: true, keepBlockTags: true, resolvePaths: false }
      )
    )
    .pipe(gulp.dest('./public'))
})

gulp.task('swap', function() {
  return (
    gulp
      .src(html)
      // .pipe(debug({title: 'full swap:'}))
      .pipe(
        htmlreplace(
          {
            css: {
              src: [
                [
                  '/build-assets/css/concat.min.css',
                  gulpConfig.cachebust.js_bundle
                ]
              ],
              tpl: '<link rel="stylesheet" type="text/css" href="%s?v=%s"/>'
            }
          },
          { keepUnassigned: true, keepBlockTags: true, resolvePaths: false }
        )
      )
      .pipe(
        htmlreplace(
          { killcss: '' },
          { keepUnassigned: true, keepBlockTags: true, resolvePaths: false }
        )
      )
      .pipe(
        htmlreplace(
          {
            js: {
              src: [
                [
                  '/build-assets/js/concat.min.js',
                  gulpConfig.cachebust.js_bundle
                ]
              ],
              tpl: '<script type="text/javascript" src="%s?v=%s"></script>'
            }
          },
          { keepUnassigned: true, keepBlockTags: false, resolvePaths: false }
        )
      )
      .pipe(gulp.dest('./public'))
  )
})

gulp.task('js', gulp.series(['clean:js', 'cat:js']))
gulp.task('css', gulp.series(['clean:css', 'cat:css']))
gulp.task('clean', gulp.series(['clean:css', 'clean:js']))
gulp.task('build', gulp.series(['cat:js', 'cat:css', 'swap'])) // 'webpack', 'clean'

gulp.task('jsmap', function() {
  gulp
    .src(js)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/'))
})

gulp.task('sass', function() {
  return gulp
    .src(_sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
})

gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass'])
})

gulp.task('check', gulp.parallel(['html', 'js', 'jsmap']))

// Generate & Inline Critical-path CSS
gulp.task('criticalCSS', function() {
  return gulp
    .src(top_pages)
    .pipe(
      critical({
        base: './public/',
        inline: true,
        css: ['./public/build-assets/css/concat.min.css']
      })
    )
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err.message))
    })
    .pipe(debug({ title: 'criticalCSS:' }))
    .pipe(gulp.dest('./public/'))
})

gulp.task('publishIMG', function() {
  // define custom headers
  return gulp
    .src(images)
    .pipe(awspublish.gzip({ skipGrowingFiles: true }))
    .pipe(parallelize(publisher.publish(image_headers), 32))
    .pipe(publiser.cache())
    .pipe(awspublish.reporter())
})

gulp.task('publishFonts', function() {
  return gulp
    .src(fonts)
    .pipe(awspublish.gzip({ skipGrowingFiles: true }))
    .pipe(parallelize(publisher.publish(font_headers), 4))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
})

gulp.task(
  'publishJS',
  gulp.series(['build'], function() {
    return (
      gulp
        .src(js)
        // .pipe(debug({title: 'test JS:'}))
        .pipe(minify())
        .pipe(awspublish.gzip({ skipGrowingFiles: true }))
        .pipe(parallelize(publisher.publish(js_headers), 8))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
    )
  })
)

gulp.task(
  'publishCSS',
  gulp.series(['build'], function() {
    return (
      gulp
        .src(css)
        // .pipe(debug({title: 'unicorn:'}))
        .pipe(cleanCSS({ compatibility: '*' }))
        .pipe(awspublish.gzip({ skipGrowingFiles: true }))
        .pipe(parallelize(publisher.publish(css_headers), 4))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
    )
  })
)

gulp.task('publishXML', function() {
  return gulp
    .src(xml)
    .pipe(awspublish.gzip({ skipGrowingFiles: true }))
    .pipe(publisher.publish(xml_headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
})

gulp.task(
  'publishHTML',
  gulp.series(['build'], function() {
    return (
      gulp
        .src(html)
        // .pipe(debug({title: 'unicorn:'}))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(awspublish.gzip({ skipGrowingFiles: true }))
        .pipe(parallelize(publisher.publish(html_headers), 16))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
    )
  })
)

gulp.task('publishMEDIA', function() {
  return (
    gulp
      .src(media.concat(json))
      // .pipe(debug({title: 'testMEDIA: '}))
      .pipe(awspublish.gzip({ skipGrowingFiles: true }))
      .pipe(parallelize(publisher.publish(media_headers), 8))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  )
})

gulp.task('publish', function() {
  return (
    gulp
      .src(the_rest)
      // .pipe(debug({title: 'Rest: '}))
      .pipe(awspublish.gzip({ skipGrowingFiles: true }))
      .pipe(parallelize(publisher.publish(the_rest_headers), 8))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
  )
})

gulp.task(
  'publish',
  gulp.parallel([
    'publishHTML',
    'publishIMG',
    'publishFonts',
    'publishXML',
    'publishMEDIA',
    'publishCSS',
    'publishJS',
    'publish'
  ])
)

gulp.task('openUrl', () => {
  let url = awsEnvs[options.env].url
  const command = `open ${url}`
  console.log(`${url}`)
  return cp.exec(command)
})

gulp.task(
  'default',
  gulp.series(
    ['build', 'publish', 'openUrl']
    // ()=>{ return cp.exec('open ' + url, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`)
    //     return
    //   }
    //   if (stdout) {
    //     console.log(`stdout: ${stdout}`)
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`)
    //   }
    // })
  )
)
