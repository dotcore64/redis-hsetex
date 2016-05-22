const gulp = require('gulp');
const util = require('gulp-util');
const mocha = require('gulp-mocha');
const rename = require('gulp-rename');
const lua2js = require('gulp-redis-lua2js');
const compiler = require('babel-core/register');

const src = 'src/hsetex.lua';

gulp.task('build', () => (
  gulp.src(src)
  .pipe(lua2js({ numberOfKeys: 1 }))
  .pipe(rename(path => {
    path.basename = 'index';
  }))
  .pipe(gulp.dest('lib'))
));

gulp.task('test', ['build'], () => (
  gulp.src('test')
  .pipe(mocha({
    compilers: { // TODO: remove once gulp-mocha supports test/mocha.opts
      js: compiler,
    },
  }))
  .on('error', util.log)
));

gulp.task('watch', () => {
  gulp.watch(src, ['test']);
});

gulp.task('develop', ['watch']);

gulp.task('default', ['develop']);
