import { nodeResolve } from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/out.js',
    format: 'esm'
  },

  plugins: [
    nodeResolve({ extensions: ['.js'] }),
    copy({targets: [
      { src: 'runtime/*', dest: 'dist/runtime' },
      { src: 'assets/*', dest: 'dist/assets' }
    ]}),
    uglify()
  ]
}
