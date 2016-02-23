import webpack from 'webpack';
import Immutable, {List, Map} from 'immutable';

let hotMiddlewareClient = 'webpack-hot-middleware/client?reload=true';

export default hotReload;

function hotReload() {
  return c$ => (
    c$
      .map(addPlugins)
      .map(addToEntry)
  );
}

function addPlugins(c) {
  return c.mergeIn(['plugins'], {
    occurenceOrderPlugin: new webpack.optimize.OccurenceOrderPlugin(),
    hotModuleReplacementPlugin: new webpack.HotModuleReplacementPlugin(),
    noErrorsPlugin: new webpack.NoErrorsPlugin()
  });
}

function addToEntry(c) {
  return c.updateIn(['entry'], (entry) => {
    if (List.isList(entry)) {
      return entry.unshift(hotMiddlewareClient);
    } else if (Map.isMap(entry)) {
      return entry.map(entryItem => {
        if (List.isList(entryItem) && !entryItem.findIndex(containsHotClient) > -1) {
          return entryItem.push(hotMiddlewareClient);
        }

        return List([entryItem, hotMiddlewareClient]);
      });

    } else {
      console.log('[hot-reload.config] Error: List or Map required');
    }

    return entry;
  });
}

function containsHotClient(entryPath) {
  return RegExp('^webpack-hot-middleware\/client', 'i').test(entryPath);
}
