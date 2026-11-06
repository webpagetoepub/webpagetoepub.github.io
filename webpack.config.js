import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import oxipngOptimise, {
  init as oxipngInit,
} from "@jsquash/oxipng/optimise.js";
import { globSync } from "glob";
import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// This config is loaded as an ES module (it uses `import`), so the CommonJS
// globals `require` and `__dirname` must be reconstructed.
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lossless PNG optimizer backed by OxiPNG compiled to WebAssembly (no native
// binary / OS package needed). @jsquash/oxipng is browser-first: its default
// init() fetch()es the .wasm, which Node can't do, so the bytes are read from
// disk and handed to init() once. The module caches the instance, so later
// optimise() calls reuse it. Used as a custom image-minimizer-webpack-plugin
// minimizer below; runs only in this production build.
let oxipngReady;
function ensureOxipng() {
  if (!oxipngReady) {
    const wasm = readFileSync(
      require.resolve("@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm"),
    );
    oxipngReady = oxipngInit(wasm);
  }
  return oxipngReady;
}

async function oxipngMinify(original) {
  if (!/\.png$/i.test(original.filename)) {
    return original;
  }
  try {
    await ensureOxipng();
    const input = original.data;
    const optimized = await oxipngOptimise(
      input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength),
      { level: 6, interlace: false },
    );
    return {
      filename: original.filename,
      data: Buffer.from(optimized),
      info: {
        ...original.info,
        minimized: true,
        minimizedBy: [...(original.info?.minimizedBy ?? []), "oxipng"],
      },
      warnings: [...original.warnings],
      errors: [...original.errors],
    };
  } catch (error) {
    original.errors.push(error);
    return original;
  }
}

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

// Minifies the JSON inside <script type="application/ld+json"> blocks of the
// generated HTML. html-minifier-terser's minifyJS only handles JavaScript, so
// the structured data is parsed and re-stringified without whitespace here.
// Keeping the source template indented stays readable; the shipped HTML is compact.
class MinifyJsonLdPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MinifyJsonLdPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        "MinifyJsonLdPlugin",
        (data) => {
          data.html = data.html.replace(
            /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
            (_, open, body, close) =>
              open + JSON.stringify(JSON.parse(body)) + close,
          );
          return data;
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
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
      // Lossless image optimization for assets emitted into dist/ (including
      // the static files copied from assets/ by CopyPlugin). SVG via svgo
      // (pure JS); PNG via the OxiPNG/WASM minimizer above. Both are lossless.
      new ImageMinimizerPlugin({
        test: /\.(png|svg)$/i,
        minimizer: [
          {
            implementation: ImageMinimizerPlugin.svgoMinify,
            filter: (_source, name) => /\.svg$/i.test(name),
            options: {
              encodeOptions: { multipass: true, plugins: ["preset-default"] },
            },
          },
          {
            implementation: oxipngMinify,
          },
        ],
      }),
    ],
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

    new MinifyJsonLdPlugin(),
  ],
};
