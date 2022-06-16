const fs = require('fs');
const path = require('path');

const cwd = path.dirname(require.main.filename);
const environment = process.env.NODE_ENV || 'development';

if (environment === 'development') {
  try {
    fs.copyFileSync(
      path.resolve(cwd, '../node_modules/oidc-client/dist/oidc-client.min.js'),
      path.resolve(cwd, '../public/oidc-client.min.js')
    );
    console.log('Renew endpoint prepared.');
  } catch (e) {
    if (fs.existsSync('../public/oidc-client.min.js')) {
      console.warn('Could not copy the library file for the renew endpoint. Using the previous version instead.');
    } else  {
      console.error('Could not copy the library file for the renew endpoint, and no previous version exists!');
      throw e;
    }
  }
}
