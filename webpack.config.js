const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = (env) => {
  const tag = (env && env.TAG_NAME) || (process && process.env && process.env.TAG_NAME);
  const hasTag = typeof tag !== 'undefined' && tag !== '';
  const gitRevisionPlugin = new GitRevisionPlugin();

  return {
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    resolve: {
      fallback: {
        "http": require.resolve("stream-http"),
        "assert": require.resolve("assert"),
        "util": require.resolve("util"),
        "crypto": require.resolve("crypto-browserify"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "stream": require.resolve("stream-browserify"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        // https://github.com/browserify/node-util/issues/43
        process: 'process/browser',
        // https://github.com/webpack/changelog-v5/issues/10
        Buffer: ['buffer', 'Buffer'],
        $: 'zepto-webpack',
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        inject: false,
      }),
      new MiniCssExtractPlugin({
        filename: hasTag ? `[name].${tag}.css` : '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new CopyPlugin({ patterns: [{ from: 'static/*', flatten: true }] }, {
        // Always copy (for --watch / webpack-dev-server). Needed
        // because CleanWebpackPlugin wipes everything out.
        copyUnmodified: true,
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify((env && env.NODE_ENV) || 'dev'),
        __VERSION: JSON.stringify(gitRevisionPlugin.version()),
        __COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        __BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      }),
    ],
    devtool: (env && env.NODE_ENV === 'production') ? 'hidden-source-map' : false,
    entry: {
      index: './src/index.js',
    },
    output: {
      filename: hasTag ? `[name].${tag}.js` : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, use: [{ loader: 'babel-loader' }, { loader: 'eslint-loader', options: { fix: true } }] },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
        { test: /\.hbs$/, loader: 'handlebars-loader' },
        { test: /\.svg$/, loader: 'svg-inline-loader' },
      ],
    },
  };
};
