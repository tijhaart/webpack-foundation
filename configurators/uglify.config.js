import _ from 'lodash';
import webpack from 'webpack';

export default uglify;

function uglify(options) {
  options = _.defaults(options, {
    compress: {
      warnings: false
    }
  });

  return c$ => c$.map(c => (
    c.setIn(['plugins', 'uglify'], new webpack.optimize.UglifyJsPlugin(options))
  ));
}
