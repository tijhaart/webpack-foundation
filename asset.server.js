/* eslint strict: 0, no-console: 0 */
'use strict';

import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config from './webpack.config.js';
import express from 'express';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

let app = express();
let compiler = webpack(config);

app.use(devMiddleware(compiler, config.devServer));
app.use(hotMiddleware(compiler));

const {host, port} = config.devServer;

app.get(/\.html$/i, (req, res) => res.sendStatus(403));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, host, err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`\n >> Listening at http://${host}:${port}\n`);
});
