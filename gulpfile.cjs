const { task, src, dest, parallel } = require('gulp');
const rename = require('gulp-rename');
const lua2js = require('gulp-redis-lua2js');

task('cjs', () =>
  src('src/hsetex.lua')
    .pipe(lua2js({ numberOfKeys: 1 }))
    .pipe(rename(path => ({
      ...path,
      basename: 'index',
      extname: '.cjs'
    })))
    .pipe(dest('dist')),
);

task('esm', () =>
  src('src/hsetex.lua')
    .pipe(lua2js({ numberOfKeys: 1, type: 'module' }))
    .pipe(rename(path => ({
      ...path,
      basename: 'index',
    })))
    .pipe(dest('dist')),
);

task('build', parallel('cjs', 'esm'));
task('default', task('build'));
