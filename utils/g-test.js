var gulp = require('gulp');
require('../gulpfile');

// console.log(gulp.tasks);

if (gulp.tasks.clean) { 
    console.log('gulpfile contains task!');
    gulp.start('clean');
}