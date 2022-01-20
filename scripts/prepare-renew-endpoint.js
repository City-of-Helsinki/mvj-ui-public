const fs = require('fs');
const path = require('path');

const cwd = path.dirname(require.main.filename);

fs.copyFileSync(
  path.resolve(cwd, '../node_modules/oidc-client/dist/oidc-client.min.js'),
  path.resolve(cwd, '../public/oidc-client.min.js')
);
