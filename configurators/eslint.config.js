export default eslint;

function eslint(options={}) {
  return c$ => c$.map(c => {
    return c.updateIn(['module.preLoaders', 'eslint'], () => {
      return {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        query: options
      };
    });
  });
}
