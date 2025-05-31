const path = require('path');
const webpack = require('webpack');
//const CopyPlugin = require("copy-webpack-plugin");

const entries = {
    //readAloud: './src/renderer/js/readAloud.js',
    lunrSearch: "./src/renderer/js/searchBase/lunrSearch.js"
};

module.exports = Object.entries(entries).map(([name, entryPath]) => {
    const absEntryPath = path.resolve(__dirname, entryPath);
    const outputDir = path.dirname(absEntryPath); // Output to same folder as source

    return {
        name,
        entry: absEntryPath,
        output: {
            filename: `packed_${name}.js`,
            path: outputDir,
        },
        plugins: [
            //new RemoveWithPlugin(),
            new webpack.ProvidePlugin({
                process: 'process', // Provide process polyfill
                Buffer: ['buffer', 'Buffer'], // Provide Buffer
                crypto: ['crypto-browserify'],
            }),
        ],

        optimization: {
            usedExports: true,
            minimize: true,
            //splitChunks: {
            //chunks: 'all',
            //},
        },

        resolve: {
            extensions: ['.js', '.mjs', '.json'],
            fallback: {
                //buffer: require.resolve('buffer/'),
                path: require.resolve('path-browserify'),
                os: require.resolve('os-browserify/browser'),
                //crypto: require.resolve('crypto-browserify'),
                //vm: require.resolve('vm-browserify'),
                stream: require.resolve('stream-browserify'),
                fs: require.resolve('browserify-fs'),
                //util: require.resolve("util/"),
                zlib: require.resolve("browserify-zlib"),
                https: require.resolve("https-browserify"),
                url: require.resolve("url/"),
                http: require.resolve("stream-http"),
                assert: require.resolve("assert/"),
                process: require.resolve('process'),
                child_process: false //'child-process-promise'
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        /*options: {
                          presets: ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] }}]
                          }*/
                    }
                },
            ],
        },
        devtool: 'source-map', // Consider using source maps for better debugging
        mode: 'development',
    }

});
