export default function(dirname, cache=false) {
  return c$ => c$.map(c => c.setIn(
    ['output'], {
      path: `${dirname}/dist`,
      filename: `[name].js${cache ? '?[chunkhash]' : ''}`,
      publicPath: '/static/'
    }
  ));
}
