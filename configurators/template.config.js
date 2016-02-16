import _ from 'lodash';

export default template;

function template(loader, options) {
  options = _.defaults(options, {
    delimiter: '{{=${ }=}}',
    minify: false
  });

  loader = _.defaults(loader, {
    test:  /\.tpl\.(html|mst|mustache)$/,
    loader: `mustache?${options.minify ? 'minify' : ''}!wrap?mustache`,
    exclude: /(node_modules|bower_components)/
  });

  return c$ =>
    c$
      .map(c => c.setIn(['module.loaders', 'mustache'], loader))
      .map(c => c.setIn(['wrap', 'mustache', 'before'], [
        // Use non-standard mustache delimiter to prevent conflicts with angular template delimiters
        // Note: html comment is not part of the delimiters
        options.delimiter
      ]))
  ;
}
