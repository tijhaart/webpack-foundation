module.exports = template;

/**
 * @TODO How to make this configurable from webpack config?
 * @note This function is run within the webpack context. Loaders will be applied on `require`.
 */
function template(res, chunks, assets, compilation) {
  return require('index.tpl.mustache')({
    env: {
      production: process.env.NODE_ENV === 'production',
      development: process.env.NODE_ENV === 'development',
    },
    publicPath: __webpack_public_path__
  });
}
