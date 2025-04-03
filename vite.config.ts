import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2234', //'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 2233
  },
  plugins: [
    react(),
    chunkSplitPlugin({
      strategy: 'default',/*
      customSplitting: { // 目录下的所有文件会被合并成一个 chunk
        'pages': [/src\/pages/],
        'components': [/src\/components/]
      }*/
    })
  ],
});