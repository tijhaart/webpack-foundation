import _ from 'lodash';

export default image;

function image(loader) {
  loader = _.defaultsDeep(loader, {
  	test: /\.(jpe?g|png|gif)$/i,
  	loader: 'url-loader',
  	query: {
      limit: 10 * 1000, // 10 kb
  		name: '[path][name].[ext]'
  	}
  });

  return c$ => c$.map(c => (
    c.setIn(['module.loaders', 'image'], loader)
  ));
}
