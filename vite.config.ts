import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts'
import generateFile from 'vite-plugin-generate-file'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

function defineApiConfig() {
  const outDir = 'extension_api'

  return defineConfig({
    plugins: [
      nodePolyfills(),
      dts({ insertTypesEntry: true }),
      generateFile({
        type: 'json',
        output: './package.json',
        data: {
          name: `@threefold/${outDir}`,
          version: process.env.npm_package_version,
          private: false,
          publishConfig: { access: 'public' },
          main: `${outDir}.mjs`,
          types: `${outDir}.d.ts`,
          license: 'MIT'
        }
      })
    ],
    build: {
      copyPublicDir: false,
      outDir,
      lib: {
        entry: { api: resolve(__dirname, 'api/index.ts') },
        fileName: outDir,
        name: outDir,
        formats: ['es']
      }
    }
  })
}

function defineAppConfig() {
  return defineConfig({
    build: {
      copyPublicDir: true,
      outDir: 'extension'
    },
    plugins: [vue(), nodePolyfills()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}

export default () => {
  if (process.env.TARGET === 'API') return defineApiConfig()
  return defineAppConfig()
}
