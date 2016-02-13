import _ from 'lodash';

export default babel;

function babel(options={}) {
  options = _.defaults(options, {
    test:  /\.(js|jsx)$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/,
    query: {
      presets: ['es2015', 'stage-1']
    }
  });

  return c$ => c$.map(c => {
    return c.updateIn(['module.loaders', 'babel'], () => {
      return options;
    });
  });
}
