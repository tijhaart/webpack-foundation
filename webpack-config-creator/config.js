import createConfig from './config-creator';
import path from 'path';
import _ from 'lodash';

function webpackConfig(options) {
  return createConfig(null, _.defaults(options, {
    entry: './src/app.js',
    'module.loaders': {},
    'module.preLoaders': {},
    'plugins': {}
  }));
}

function exportToWebpackConfig(c$) {
  return c$.map(c => {
    return c
      .setIn(['module', 'loaders'], c.getIn(['module.loaders']).toArray())
      .deleteIn(['module.loaders'])

      .setIn(['module', 'preLoaders'], c.getIn(['module.preLoaders']).toArray())
      .deleteIn(['module.preLoaders'])

      .setIn(['plugins'], c.getIn(['plugins']).toArray())
    ;
  });
}

export default webpackConfig;
export {
  exportToWebpackConfig
};
