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
    return c.updateIn(['resolve', 'modulesDirectories'], (x) => {
      return x.push(path.resolve(c.get('context'), options.directory));
    });
  }
}

function addPlugin(c) {
  return c.setIn(
    ['plugins', 'bower'],

    new ResolverPlugin([
       new ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ], ["normal", "loader"])
  );
}
