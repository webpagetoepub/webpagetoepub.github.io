import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";
import { globSync } from "glob";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// This config is loaded as an ES module (it uses `import`), so the CommonJS
// globals `require` and `__dirname` must be reconstructed.
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://webpagetoepub.github.io/";

// Version shown in the page footer, read from package.json at build time.
const { version: APP_VERSION } = require("./package.json");

// Last modification date: the build date (YYYY-MM-DD).
function lastModified() {
  return new Date().toISOString().slice(0, 10);
}

// Emits dist/sitemap.xml at build time. The site is single-page, so the
// sitemap holds one URL; add more <url> entries here if pages are added.
class SitemapPlugin {
  apply(compiler) {
    const { RawSource } = compiler.webpack.sources;
    compiler.hooks.thisCompilation.tap("SitemapPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "SitemapPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            "  <url>",
            `    <loc>${SITE_URL}</loc>`,
            `    <lastmod>${lastModified()}</lastmod>`,
            "    <changefreq>monthly</changefreq>",
            "    <priority>1.0</priority>",
            "  </url>",
            "</urlset>",
            "",
          ].join("\n");
          compilation.emitAsset("sitemap.xml", new RawSource(xml));
        },
      );
    });
  }
}

export default {
  mode: "production",
  entry: {
    bundle: ["./src/js/main.ts", "./src/js/style.js"],
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/script.[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
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
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "assets", to: "./" }],
    }),

    new SitemapPlugin(),

    new MiniCssExtractPlugin({
      filename: "css/style.[contenthash].css",
    }),
    new PurgeCSSPlugin({
      paths: globSync("src/**/*.html", { nodir: true }),
      safelist: ["progress", "output", "info", "error"],
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.template.html",
      templateParameters: { version: APP_VERSION },
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
};
