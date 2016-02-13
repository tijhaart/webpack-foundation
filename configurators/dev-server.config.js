import _ from 'lodash';

export default devServer;

function devServer(serverOptions, options={verbose: false}) {
  serverOptions = _.defaults(serverOptions, {
    publicPath: '/static/',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: options.verbose,
    noInfo: !options.verbose,
    quiet: !options.verbose,
    stats: !options.verbose ? 'errors-only' : { colors: true },
    host: 'localhost',
    port: 8080
  });

  return c$ => c$.map(c => (
    c.setIn(['devServer'], serverOptions)
  ));
}
