import Config, {exportToWebpackConfig} from './webpack-config-creator';
import path from 'path';
import util from 'util';
import webpack from 'webpack';

import {
  output,
  eslint,
  devServer,
  hotReload,
  babel,
  style,
  bundleTracker
} from './configurators';

/**
 * Bower
 * new webpack.ResolverPlugin([
    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
], ["normal", "loader"])
 */

const env = getEnv();

const config = Config({
    profile: env.development,
    progress: true,
    context: __dirname,
    entry: {
      main: './src/app.js',
      'app.style': './src/app.global.style.scss'
    },
    devtool: env.development ? 'cheap-eval-source-map' : '',
    cache: true,
    debug: env.development,
    resolve: {
      root: [path.resolve(__dirname, 'src')],
      modulesDirectories: [path.resolve(__dirname, 'node_modules')]
    }
  })
  .use(output(__dirname, env.production))

  .use(babel())
  
  .use(style({
    test: /^((?!\.local\.style).)*\.(css|scss)$/
  }, {
    basicSourceMap: env.development,
    cssModules: false,
    postCss: false,
    loaderKey: 'vendorStyle'
  }))
  .use(style({
    test: /\.local\.style\.(css|scss)$/
  }, {
    basicSourceMap: env.development,
    cssModules: true,
    postCss: true
  }))

  .use(bundleTracker({
    indent: env.development ? 2 : undefined
  }))
  .useIf(env.development, hotReload())
  .use(devServer({
      contentBase: path.resolve('./dist'),
      host: 'localhost',
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
  return {
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development'
  };
}
