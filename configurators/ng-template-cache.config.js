import _ from 'lodash';

export default ngTemplateCache;

function ngTemplateCache(loader, options) {
  options = _.defaults(options, {
    context: null
  });

  loader = _.defaults(loader, {
    test: /\.html$/i,
    loaders: [
      `ngtemplate?relativeTo=${options.context}/src/`,
      'html'
    ]
  });

  return c$ => c$.map(c => (
    c.setIn(['module.loaders', 'ngTemplateCache'], loader)
  ));
}
