import webpack from 'webpack';
import Immutable, {List} from 'immutable';

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
    var hotMiddleware = 'webpack-hot-middleware/client?reload=true';
    // @TOD don't make it entry dependent
    return entry
      .set('main', [entry.get('main'), hotMiddleware])
      .set('app.style', [entry.get('app.style'), hotMiddleware])
      ;

    // if (List.isList(entry)) {
    //   entry = entry.unshift('webpack-hot-middleware/client?reload=true');
    // } else {
    //   console.log('[hot-reload.config] Error: Only Immutable.List is currently supported');
    // }
    // return entry;
  });
}
