const path = require('path')
const version = require('../package.json').version
const banner = `
/**
 * Kyue v${version}
 * (c) ${new Date().getFullYear()} kaiyu5609
 * @license MIT
 */
`
const replace = require('rollup-plugin-replace')
// const buble = require('rollup-plugin-buble')
const rollupTypescript = require('rollup-plugin-typescript2')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const alias = require('rollup-plugin-alias')

const aliases = require('./alias')

/**
 * __dirname: /Volumes/Seagate/workspaces/kata_projects/my-rollup/build
 */
const resolve = _path => {
    const base = _path.split('/')[0]
    if (aliases[base]) {
        return path.resolve(aliases[base], _path.slice(base.length + 1))
    } else {
        return path.resolve(__dirname, '../', _path)
    }
}


const configs = {
    commonjs: {
        input: resolve('src/index.ts'),
        file: resolve('dist/kyue.common.js'),
        format: 'cjs'
    },
    esm: {
        input: resolve('src/index.ts'),
        file: resolve('dist/kyue.esm.js'),
        format: 'es'
    },
    umdDev: {
        input: resolve('src/index.ts'),
        file: resolve('dist/kyue.js'),
        format: 'umd',
        env: 'development'
    },
    umdProd: {
        input: resolve('src/index.ts'),
        file: resolve('dist/kyue.min.js'),
        format: 'umd',
        env: 'production'
    }
}

function genConfig(opts) {

    const config = {
        input: opts.input,
        plugins: [
            rollupTypescript(),
            alias(Object.assign({
                resolve: ['.js', '.ts'],
            }, aliases, opts.alias)),
            nodeResolve(),
            commonjs({ extensions: ['.js', '.ts'] }),
            // babel({
            //     exclude: 'node_modules/**',
                // plugins: ['@babel/external-helpers']
            // })
            postcss({
                extract: resolve('dist/kyue.css'),
                extensions: ['.css','.scss']
            })
        ],
        // external: ['jquery']
        output: {
            banner,
            file: opts.file,
            format: opts.format,
            name: 'kyue',
            // globals: {
            //     jquery: 'jQuery'
            // }
        }
    }

    const replaceOpts = {
        __VERSION__: version
    }

    if (opts.env) {
        replaceOpts['process.env.NODE_ENV'] = JSON.stringify(opts.env)
    }

    config.plugins.push(replace(replaceOpts))

    return config
}


function mapValues(obj, fn) {
    const res = {}
    Object.keys(obj).forEach(key => {
        res[key] = fn(obj[key], key)
    })
    return res
}

module.exports = mapValues(configs, genConfig)