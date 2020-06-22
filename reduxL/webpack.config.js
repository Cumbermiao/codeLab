const webpack = require("webpack");
const { resolve } = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    app: resolve(__dirname, "./src/index.js")
  },
  output: {
    path: resolve(__dirname, "./dist"),
    filename: "builid.[hash:5].js"
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    hot: true,
    host: "localhost"
  },
  plugins: [new htmlWebpackPlugin(),new webpack.HotModuleReplacementPlugin()]
};
