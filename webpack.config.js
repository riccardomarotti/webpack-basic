const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");
const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([
  { entry: ["./src"] },
  { output: { path: path.resolve(process.cwd(), "dist") } },
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadImages({ limit: 15000 }),
  parts.loadJavaScript(),
  parts.clean(),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[contenthash].js",
      filename: "[name].[contenthash].js",
      assetModuleFilename: "[name].[contenthash][ext][query]",
    },
  },
  parts.minifyJavaScript(),
  parts.minifyCSS({ options:
      {
        preset: [
          "default",
          {
            discardComments: { removeAll: true },
          }
        ],
      },
  }),
  parts.eliminateUnusedCSS(),
  parts.generateSourceMaps({ type: "source-map" }),
  parts.attachRevision(),
]);

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer(),
]);


const getConfig = (mode) => {
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
