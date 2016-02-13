import _ from 'lodash';
import autoprefixer from 'autoprefixer';

export default style;

function style(loader={}, options={}) {
  options = _.defaults(options, {
    cssModules: false,
    basicSourceMap: false,
    loaderKey: 'style',
    postCss: false
  });

  let cssLoaderOptions = [];
  if (options.cssModules) {
    cssLoaderOptions.push('modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]');
  }
  if (options.basicSourceMap) {
    cssLoaderOptions.push('sourceMap');
  }

  let loaders = ['style', `css?${cssLoaderOptions.join('&')}`];
  if (options.postCss) {
    loaders.push('postcss');
  }
  loaders.push('sass');

  loader = _.defaults(loader, {
    test:  /\.(css|scss)$/,
    loaders: loaders
  });

  const sassLoader = {
    sourceComments: options.basicSourceMap
  };

  return c$ =>
    c$
      .map(c => c.setIn(['module.loaders', options.loaderKey], loader))
      .map(c => options.postcss ? c.setIn(['postcss'], [autoprefixer]) : c)
      // @TODO don't set if sassLoader is already present
      .map(c => c.set('sassLoader', sassLoader))
    ;
}

/**
 * Notes:
 * For prerendering with extract-text-webpack-plugin you should use css-loader/locals instead of style-loader!css-loader
 * in the prerendering bundle. It doesn't embed CSS but only exports the identifier mappings.
 * https://github.com/webpack/css-loader
 */
