require("dotenv").config();

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const requiredEnvVars = {
    CHROME_STORE_URL: process.env.CHROME_STORE_URL,
    EDGE_STORE_URL: process.env.EDGE_STORE_URL,
    OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  };

  // Validate all required environment variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`${key} not found. Please check your .env file.`);
    }
  });

  const storeUrl = requiredEnvVars[`${env.store.toUpperCase()}_STORE_URL`];

  return {
    entry: "./src/background.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "src/manifest.json", to: "manifest.json" },
          { from: "src/privacy.md", to: "privacy.md" },
          { from: "src/tab.html", to: "tab.html" },
          { from: "public", to: "public" },
        ],
      }),
      new webpack.DefinePlugin({
        STORE_URL: JSON.stringify(storeUrl),
        OPENWEATHERMAP_API_KEY: JSON.stringify(
          requiredEnvVars.OPENWEATHERMAP_API_KEY
        ),
        PEXELS_API_KEY: JSON.stringify(requiredEnvVars.PEXELS_API_KEY),
      }),
    ],
  };
};
