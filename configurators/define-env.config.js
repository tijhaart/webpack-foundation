import {DefinePlugin} from 'webpack';

export default defineNodeEnv;

function defineNodeEnv(env = process.env.NODE_ENV) {
  env = env || 'ENV_UNKNOWN';

  return c$ => c$
    .map(c => (
      c.setIn(['plugins', 'defineNodeEnv'], new DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env)
        }
      }))
    ));
}
