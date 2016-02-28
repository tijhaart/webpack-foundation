import HtmlWebpackPlugin from 'html-webpack-plugin';
import _ from 'lodash';

export default htmlWebpack;

function htmlWebpack(options) {
  options = _.defaults(options, {
    template: __dirname + '/template.js',
    inject: false
  });

  return c$ => c$.map(c => (
    c.setIn(['plugins', 'htmlWebpack'], new HtmlWebpackPlugin(options))
  ));
}
