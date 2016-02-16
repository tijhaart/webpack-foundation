import _ from 'lodash';

export default font;

function font(loader, options) {
  loader = _.defaults(loader, {
    test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
    loader: 'url',
    query: {
      name: '[path][name].[ext]'
    }
  });

  return c$ => c$.map(c =>
    c.setIn(['module.loaders', 'font'], loader)
  );
}
