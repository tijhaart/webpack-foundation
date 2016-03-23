// jscs: disable
// jshint ignore:start
import Config, {exportToWebpackConfig} from 'webpack-config-builder';
import path from 'path';
import util from 'util';
import webpack, {ProvidePlugin} from 'webpack';

import {
  output,
  eslint,
  devServer,
  hotReload,
  babel,
  style,
  bundleTracker,
  template,
  bower,
  font,
  ngAnnotate,
  shimAngular,
  uglify,
  ngTemplateCache,
  image,
  defineNodeEnv,
  htmlWebpack
} from './configurators';

const env = getEnv();

const config = Config({
    cache: true,
    profile: false, //env.development,
    progress: true,
    context: __dirname,
    debug: env.development,
    entry: {
      main: './src/app.js',
      'app.style': [
        './src/styles/app.foundation.style.scss',
        './src/styles/app.global.style.scss']
    },
    devtool: env.development ? '#cheap-eval-module-inline-source-map' : undefined,
    resolve: {
      root: [path.resolve(__dirname, 'src')],
      modulesDirectories: [
        path.resolve(__dirname, 'node_modules'),
      ]
    }
  })
  .use(output(__dirname, env.production))

  /* JS */
  .use(ngAnnotate())
  .use(babel())

  /* CSS */
  .plugin(appStyle)

  // IMAGE
  .use(image({
    query: {
      name: env.production ? 'images/[name]__[hash].[ext]' : undefined
    }
  }))

  // FONT
  .use(font())

  // TEMPLATE
  .use(htmlWebpack())
  .use(template(null, {
    minify: env.production
  }))
  .use(ngTemplateCache(null, {context: __dirname}))

  // MISC
  // .useIf(env.development, codeStyle)
  .use(defineNodeEnv())
  .use(shimAngular)
  .use(bower())
  .use(bundleTracker({
    indent: env.development ? 2 : undefined
  }))
  .useIf(env.development, hotReload())
  .useIf(env.production, optimizeBuild)
  .useIf(env.production, uglify())
  .use(devServer({
      contentBase: path.resolve('./dist'),
      publicPath: '/static/',
      host: '0.0.0.0',
      port: 9090,
      hot: env.development
    }, {
      verbose: env.development
    }
  ))
  .use(exportToWebpackConfig)
;

let _config = config.toJs();
console.log(util.inspect(_config, {depth: 3, colors: true}));

export default _config;

function getEnv() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        development: true,
        production: false,
      };
    case 'production':
      return {
        production: true,
        development: false,
      };
    default:
      return {
        production: true,
        development: false,
      };
  }
}

// app specific style config
function appStyle(config) {
  const env = getEnv();

  return config
    .use(style({
      // load only (s)css files that DON'T contain .local.style
      test: /app\.foundation\.style\.scss$/,
    }, {
      basicSourceMap: env.development,
      loaderKey: 'vendorStyle',
      postCss: false,
      bundle: env.production,
      bundleId: 'css/vendor.css'
    }))
    .use(style({
      // load only (s)css files that contain .local.style
      test: /\.local\.style\.(css|scss)$/
    }, {
      basicSourceMap: env.development,
      loaderKey: 'appComponents',
      // css-modules are a bit tricky with hot-updating because the css-loader exports an object, so disabled for now
      // Possible insipiration on how to approach this:
      // - https://github.com/markmarijnissen/angular-webpack-seed
      cssModules: false,
      postCss: true,
      bundle: env.production,
      bundleId: 'css/app.components.css'
    }))
    .use(style({
      // load only (s)css files that DON'T contain .local.style
      test: /^((?!\.local\.style).)*\.(css|scss)$/,
      exclude: /(node_modules|bower_components|app\.foundation\.style\.scss)/
    }, {
      basicSourceMap: env.development,
      loaderKey: 'appStyle',
      postCss: true,
      bundle: env.production,
      bundleId: 'css/app.css'
    }))
  ;
}

/* @note hotReload requires some these as well, but hotReload is not used in production build */
function optimizeBuild(c$) {
  return c$.map(c => (
    c.mergeIn(['plugins'], {
      /* dedupe = deduplicate. shrinks dependecy tree by using the same dependecy once when there are duplicates of it */
      dedupePlugin: new webpack.optimize.DedupePlugin(),
      occurenceOrderPlugin: new webpack.optimize.OccurenceOrderPlugin(),
      noErrorsPlugin: new webpack.NoErrorsPlugin()
    })
  ));
}

function codeStyle(c$) {
  return c$.map(c => (
    c.setIn(['module.preLoaders', 'codeStyle'], {
      test: /\.js$/,
      loaders: ['jscs', 'jshint'],
      include: __dirname + '/src'
    })
  ));
}
