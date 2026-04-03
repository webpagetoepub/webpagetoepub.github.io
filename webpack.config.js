const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    bundle: [
      './js/main.js',
      './js/style.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'js/script.[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'manifest.webmanifest',
        'apple-touch-icon.png',
        'BingSiteAuth.xml',
        'browserconfig.xml',
        'favicon.ico',
        'googlef50cea303c1ea669.html',
        'robots.txt',
        'sitemap.xml',
        {from: 'img', to: 'img'},
        {from: 'js/jszip.min.js', to: 'js/jszip.min.js'},
        {from: 'js/ejs.min.js', to: 'js/ejs.min.js'},
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css',
    }),

    new HtmlWebpackPlugin({
      template: './index.src.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),

    new WorkboxPlugin.GenerateSW({
      exclude: [
        'BingSiteAuth.xml',
        'browserconfig.xml',
        /^google[0-9a-f]*.html/,
        'robots.txt',
        'sitemap.xml',
      ],
      swDest: 'ws.js',
      ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/,
      ],
      sourcemap: false,
    }),
  ],
};
