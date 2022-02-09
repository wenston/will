import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import postcssNesting from 'postcss-nesting'
import precss from 'precss';

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
        postcssNesting,
        precss
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
  resolve: {
    alias: {
      'will-ui': '/src/packages', //绝对路径
      'decoration-types': '/src/views/decoration/config/types.ts',
      'decoration-symbols': '/src/views/decoration/config/symbols.ts',
      'decoration-modules': '/src/views/decoration/modules/index.ts'
    }
  },
  server: {
    port: 100,
    open: false,
    host: '0.0.0.0'
  }
})
