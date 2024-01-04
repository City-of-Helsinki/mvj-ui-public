import { loadEnv } from 'vite';
import * as fs from 'node:fs';
import * as path from 'node:path';

const cwd = path.dirname(import.meta.url);
import.meta.env = {...import.meta.env, ...loadEnv('development', '..')};
if (import.meta.env.DEV) {
  try {
    fs.copyFileSync(
      path.resolve(cwd, '../node_modules/oidc-client-ts/dist/browser/oidc-client-ts.min.js'),
      path.resolve(cwd, '../public/oidc-client-ts.min.js')
    );
    console.log('Renew endpoint prepared.');
  } catch (e) {
    if (fs.existsSync('../public/oidc-client-ts.min.js')) {
      console.warn('Could not copy the library file for the renew endpoint. Using the previous version instead.');
    } else  {
      console.error('Could not copy the library file for the renew endpoint, and no previous version exists!');
      throw e;
    }
  }
}
