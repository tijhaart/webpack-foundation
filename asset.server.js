/* eslint strict: 0, no-console: 0 */

import path from 'path';
import util from 'util';
import webpack from 'webpack';
import config from './webpack.config.js';
import express from 'express';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

let app = express();
let compiler = webpack(config);

app.use(devMiddleware(compiler, config.devServer));
app.use(hotMiddleware(compiler));

const {
  host,
  port
} = config.devServer;

app.get(/\.(html|css)$/i, (req, res) => res.sendStatus(403));

app.get('*', (req, res, next) => {
  var filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      console.log(util.inspect(
        `[asset.server] Unable to find "${filename}". Did you configure/use html-webpack?`, {
          depth: 1,
          colors: true
        }
      ));
      return next(err);
    }

    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

app.listen(port, host, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`\n >> Listening at http://${host}:${port}\n`);
});
