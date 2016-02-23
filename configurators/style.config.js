import _ from 'lodash';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default style;

function style(loader={}, options={}) {
  options = _.defaults(options, {
    cssModules: false,
    basicSourceMap: false,
    loaderKey: 'style',
    postCss: false,
    bundle: false
  });

  let extractTextPlugin = void 0;

  if (!options.bundleId) {
    _.set(options, ['bundleId'], `${options.loaderKey}.css`);
  }

  extractTextPlugin = new ExtractTextPlugin(options.bundleId, {allChunks: true});

  let cssLoaderOptions = [];
  if (options.cssModules) {
    cssLoaderOptions.push('modules&importLoaders=1&localIdentName=[local]__[hash:base64:5]');
  }
  if (options.basicSourceMap) {
    cssLoaderOptions.push('sourceMap');
  }

  let loaders = ['style'];

  loaders.push(`css?${cssLoaderOptions.join('&')}`);

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

  if (options.bundle) {
    _.unset(loader, ['loaders', 0]);
    _.set(loader, 'loader', extractTextPlugin.extract(loader.loaders));
    _.unset(loader, 'loaders');
  }

  return c$ =>
    c$
      .map(c => c.setIn(['module.loaders', options.loaderKey], loader))
      // @TODO don't override postcss if already present but warn instead
      .map(c => options.postCss ? c.setIn(['postcss'], [autoprefixer()]) : c)
      // @TODO warn when sassLoader is already set
      .map(c => c.updateIn(['sassLoader'], (sassLoaderOptions) => (
        sassLoaderOptions || sassLoader
      )))
      .map(c => {
        if (options.bundle) {
          return c.setIn(['plugins', options.loaderKey], extractTextPlugin);
        }

        return c;
      })
    ;
}

/**
 * Notes:
 * For prerendering with extract-text-webpack-plugin you should use css-loader/locals instead of style-loader!css-loader
 * in the prerendering bundle. It doesn't embed CSS but only exports the identifier mappings.
 * https://github.com/webpack/css-loader
 */
