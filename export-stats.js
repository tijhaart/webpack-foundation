import webpack from 'webpack';
import config from './webpack.config.js';
import fs from 'fs';
import path from 'path';

config.profile = true;
let compiler = webpack(config);

compiler.run((err, stats) => {
  console.log('Compile done. Error:', err);
	!err && fs.writeFileSync(path.join(__dirname, '/stats.json'), JSON.stringify(stats.toJson()), 'utf8');
});
