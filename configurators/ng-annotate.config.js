export default ngAnnotate;

function ngAnnotate(options) {
  return c$ => c$.map(c => (
    c.setIn(['module.loaders', 'ngAnnotate'], {
      test: /src.*\.js$/,
      loader: 'ng-annotate'
    })
  ));
}
