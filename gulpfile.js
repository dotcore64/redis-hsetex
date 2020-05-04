const { task, src, dest } = require('gulp');
const rename = require('gulp-rename');
const lua2js = require('gulp-redis-lua2js');

const build = () => (
  src('src/hsetex.lua')
    .pipe(lua2js({ numberOfKeys: 1 }))
    .pipe(rename(path => ({
      ...path,
      basename: 'index',
    })))
    .pipe(dest('lib'))
);

task('build', build);
task('default', task('build'));
