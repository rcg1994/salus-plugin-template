const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  lintOnSave: false,
  publicPath: "./",
  configureWebpack: config => {
    if (!IS_PRODUCTION) {
      config.output.filename = "js/[name].[hash:8].js";
      config.output.chunkFilename = "js/[name].[contenthash:8].js";
    }
  },
  css: {
    extract: false,
  },
};
