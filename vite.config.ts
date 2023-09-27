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
