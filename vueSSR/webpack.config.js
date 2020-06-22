const webapck = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin')
let env = process.env.NODE_ENV;
const Serverconf = require("./conf/webpack.server");

const clientConf = {
  plugins: [new VueSSRClientPlugin()]
};

let defaultOpt = {
  entry: path.resolve(__dirname, "./src/webapp/entry-client.js"),
  output: {
    filename: "entry-client.js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader"
        }
      },
      { test: /\.vue$/, loader: "vue-loader" },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {test:/\.css/,loader:"vue-style-loader!css-loader"}
    ]
  },
  plugins: [new VueLoaderPlugin()],//,new htmlWebpackPlugin() 
};
let config = merge({}, defaultOpt, env == "client" ? clientConf : Serverconf);
// console.log(config.module.rules)
module.exports = config;
