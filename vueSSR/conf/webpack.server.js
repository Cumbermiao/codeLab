const path = require("path");
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = {
  entry: path.resolve(__dirname, "../src/webapp/entry-server.js"),
  target:'node',
  output: {
    filename: "entry-server.js",
    path: path.resolve(__dirname, "../dist"),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /.\ts$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  // plugins:[new VueSSRServerPlugin()]
};
