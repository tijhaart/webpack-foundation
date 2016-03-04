import {ResolverPlugin} from 'webpack';
import _ from 'lodash';
import path from 'path';

export default bower;

function bower(options) {
  options = _.defaults(options, {
    directory: 'bower_components'
  });

  return c$ => c$
    .map(addPlugin)
    .map(addToResolveModuleDirectories);

  function addToResolveModuleDirectories(c) {
    return c.updateIn(['resolve', 'root'], (x) => {
      return x.unshift(path.resolve(c.get('context'), options.directory));
    });
  }
}

function addPlugin(c) {
  return c
    // package.json should take precedence over bower.json that's why package.json is defined first
    // @link https://github.com/webpack/webpack/issues/1042
    .setIn(
      ['plugins', 'bowerNpm'],

      new ResolverPlugin([
         new ResolverPlugin.DirectoryDescriptionFilePlugin("package.json", ["main"])
      ], ["normal", "loader"])
    )
    .setIn(
      ['plugins', 'bower'],

      new ResolverPlugin([
         new ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      ], ["normal", "loader"])
    );
}
