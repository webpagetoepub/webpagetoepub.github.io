const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = {
  mode: 'production',
  entry: {
    bundle: [
      './src/js/main.ts',
      './src/js/style.js',
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false,
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/script.[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'assets', to: './'},
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync('src/**/*.html', { nodir: true }),
      safelist: ['progress'],
    }),

    new HtmlWebpackPlugin({
      template: './src/index.template.html',
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
