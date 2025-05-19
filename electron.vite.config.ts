import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// This file is the config for electron-vite, which manages Vite builds for "main", "preload", "renderer"
// It's basically the Vite-powered bundler config for all three parts of your Electron app.
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    // resolve.alias defines import aliases, just like tsconfig.paths, but for runtime resolution during build.
    /*
    tsconfig.json is for TypeScript (compile-time).
    vite.config is for Vite/Webpack (runtime bundling).
    
    If you only use tsconfig:
    TS knows where to find @shared/types.ts ✅
    But Vite will fail to bundle it ❌
    If you only use vite.config:
    Vite will resolve imports ✅
    But TS will say: “Cannot find module” ❌
    ✅ So you must define aliases in both places, keeping them in sync.
    */
    // so i can write ==> import Foo from '@lib/boo.ts'
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@assets': resolve('src/renderer/src/assets'),
        '@components': resolve('src/renderer/src/components'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@shared': resolve('src/shared'),
        '@store': resolve('src/renderer/src/store'),
        '@mocks': resolve('src/renderer/src/mocks')
      }
    },
    plugins: [react()]
  }
})
