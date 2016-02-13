import BundleTracker from 'webpack-bundle-tracker';
import _ from 'lodash';

export default bundleTracker;

function bundleTracker(options) {
  options = _.defaults(options, {
    path: null,
    filename: 'webpack-stats.json',
    indent: null
  });

  return c$ => c$.map(c => {
    return c.setIn(['plugins', 'bundleTracker'], new BundleTracker({
      path: options.path || c.get('context'),
      filename: options.filename,
      indent: options.indent
    }));
  });
}
