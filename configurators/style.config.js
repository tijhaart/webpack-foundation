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
      // @TODO don't override postcss if already present but warn instead
      .map(c => options.postCss ? c.setIn(['postcss'], [autoprefixer]) : c)
      // @TODO warn when sassLoader is already set
      .map(c => c.updateIn(['sassLoader'], (sassLoaderOptions) => (
        sassLoaderOptions || sassLoader
      )))
    ;
}

/**
 * Notes:
 * For prerendering with extract-text-webpack-plugin you should use css-loader/locals instead of style-loader!css-loader
 * in the prerendering bundle. It doesn't embed CSS but only exports the identifier mappings.
 * https://github.com/webpack/css-loader
 */
