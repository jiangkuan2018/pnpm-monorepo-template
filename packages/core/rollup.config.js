import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import * as rimraf from 'rimraf'

const development = process.env.ROLLUP_WATCH === 'true'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), { encoding: 'utf-8' }))

function removeDist() {
  return {
    name: 'rollup-plugin-remove-dist',
    buildStart(inputOptions) {
      rimraf.sync(path.resolve(__dirname, './dist'))
    }
  }
}
const dev = [
  typescript()
]
const prod = [
  removeDist(),
  typescript(),
  terser()
]

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: './dist/index.cjs.min.js',
      sourcemap: development,
      name: pkg.name
    },
    {
      format: 'es',
      file: './dist/index.es.min.js',
      sourcemap: development
    }
  ],
  plugins: development ? dev : prod,
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return
    }
    warn(warning)
  }
})