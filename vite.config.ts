import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    // jsxFactory: 'h',
    // jsxFragment: 'Fragment',
  },
  plugins: [vue(), vueJsx()],
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:8]'
    },
    postcss: {
      plugins: [
        // @ts-ignore
        autoprefixer,
        postcssNesting
        // @ts-ignore

        // postcssPresetEnv({
        //   stage: 3,
        //   features: {
        //     'nesting-rules': true, //stage是0的情况下，默认就可以嵌套
        //   },
        // }),
      ]
    }
  },
  server: {
    port: 100,
    open: false
  }
})
