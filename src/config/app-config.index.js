import Config from './app-config.module';
import './base.config';

/**
 * Optionally include a file
 */
((_require) => {
  if (_require.keys().indexOf('./local.config.js') > -1) {
    _require('./local.config.js');
  }
})(require.context('./', false, /local\.config\.js$/));

export default Config;
