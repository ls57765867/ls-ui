import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import jsx from '@vitejs/plugin-vue-jsx'

const pkgRoot = '../packages'
const lsRoot = '../packages/ls-ui'
// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: [
  //     {
  //       find: /^ls-ui(\/(es|lib))?$/,
  //       replacement: path.resolve(lsRoot, 'index.ts')
  //     },
  //     {
  //       find: /^ls-ui\/(es|lib)\/(.*)$/,
  //       replacement: `${pkgRoot}/$2`
  //     }
  //   ]
  // },
  plugins: [
    vue(),
    jsx(),
    AutoImport({
      imports: ['vue', 'vue-router', { pinia: ['defineStore', 'storeToRefs'] }],
      dirs: ['./components/**'],
      dts: true,
      eslintrc: {
        enabled: true // <-- this
      }
    })
    // Components({
    //   include: `${__dirname}/**`,
    //   resolvers: ElementPlusResolver({ importStyle: 'sass' }),
    //   dts: false
    // })
  ]
})
