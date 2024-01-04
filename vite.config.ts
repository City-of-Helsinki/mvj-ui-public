/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import postcssUrl from 'postcss-url';
// https://vitejs.dev/config/


export default defineConfig({
  base: '/',
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: {
      // redux-oidc wraps oidc-client, but app needs to use oidc-client-ts for PKCE support,
      // this resolves oidc-client as oidc-client-ts for redux-oidc 
      'oidc-client': 'oidc-client-ts'
    }
  },
  test: {
    include: ['**/*{test,spec}.?(c|m)[jt]s?(x)',],
    globals: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { // copy 3rd party assets to build
          src: 'node_modules/leaflet-draw/dist/images/*',
          dest: 'assets/images/.'
        },
        // Copy oidc-client-ts to be used in silent_renew.html
        { src: 'node_modules/oidc-client-ts/dist/browser/oidc-client-ts.min.js', dest: '' },
      ]
    }),
    react(),
    svgr({
      svgrOptions: {},
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssUrl({
          url: (asset) => {
            if (asset.relativePath && !['src', 'assets'].includes(asset.relativePath.split('/')[0])) {
              return `/assets/${asset.url}`;
            }
            return asset.url;
          }
        }),
      ]
    }
  },
  envDir: './',
  envPrefix: 'REACT_',
  server: {
    host: 'localhost',
    port: 4000,
    origin: 'http://localhost:4000'
  }
});
