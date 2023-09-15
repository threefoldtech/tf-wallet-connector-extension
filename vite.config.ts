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
      dts({
        insertTypesEntry: true,
        rollupTypes: true,
        copyDtsFiles: true
      }),
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
    publicDir: './api/public',
    build: {
      copyPublicDir: true,
      emptyOutDir: true,
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

function defineExtensionConfig() {
  return defineConfig({
    build: {
      copyPublicDir: true,
      emptyOutDir: true,
      outDir: 'extension',
      rollupOptions: {
        input: resolve(__dirname, 'index.html')
      }
    },
    plugins: [vue(), nodePolyfills()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}

function defineBusConfig(name: string) {
  return defineConfig({
    build: {
      copyPublicDir: false,
      emptyOutDir: false,
      outDir: 'extension',
      rollupOptions: {
        input: resolve(__dirname, 'bus', `${name}.ts`),
        output: {
          entryFileNames: `${name}.js`,
          inlineDynamicImports: true
        }
      }
    }
  })
}

export default () => {
  // prettier-ignore
  switch (process.env.TARGET) {
    case 'API': return defineApiConfig()
    case 'BACKGROUND': return defineBusConfig('background')
    case 'CONTENT': return defineBusConfig('content')
    case 'INJECT': return defineBusConfig('inject')
    default: return defineExtensionConfig()
  }
}
