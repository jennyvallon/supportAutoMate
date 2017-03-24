var gulp = require('gulp');
var config = require('./gulpfile/config.js');//external config file used to implement more control over builds
var nodemon = require('gulp-nodemon');
var funct = require('./gulpfile/functions.server.gulpfile');

gulp.task('runSeleniumServer', funct.runCommand('nohup java -jar selenium-server-standalone-3.0.1.jar'));

gulp.task('start', function () {
  nodemon(config.nodemon.options);
});

gulp.task('default', gulp.parallel('runSeleniumServer','start')); 

   