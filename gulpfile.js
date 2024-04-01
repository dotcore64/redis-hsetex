import { task, src, dest } from 'gulp';
import rename from 'gulp-rename';
import lua2js from 'gulp-redis-lua2js';

task('build', () => src('src/hsetex.lua')
  .pipe(lua2js({ numberOfKeys: 1, type: 'module' }))
  .pipe(rename((path) => ({
    ...path,
    basename: 'index',
  })))
  .pipe(dest('dist')));

task('default', task('build'));
