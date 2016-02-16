export default shimAngular;

function shimAngular(c$) {
  return c$.map(c => (
    c
      .setIn(['module.loaders', 'exportAngular'], {
        test: /[\/]angular\.js$/,
        loader: "exports?angular"
      })
  ));
}
