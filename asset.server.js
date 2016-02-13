/* eslint strict: 0, no-console: 0 */
'use strict';

import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config from './webpack.config.js';
import express from 'express';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import pkg from './package.json';

import Mustache from 'mustache';
import fs from 'fs';
const template = fs.readFileSync('./src/index.mustache', 'utf-8');
Mustache.parse(template);

let app = express();
let compiler = webpack(config);

app.use(devMiddleware(compiler, config.devServer));
app.use(hotMiddleware(compiler));

const {host, port} = config.devServer;

app.get('*', (req, res) => {
	// res.sendFile(path.join(__dirname, 'app', 'index.html'));
	res.send(Mustache.render(template, {
		pkg: pkg
	}));
});

app.listen(port, host, err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`\n >> Listening at http://${host}:${port}\n`);
});
