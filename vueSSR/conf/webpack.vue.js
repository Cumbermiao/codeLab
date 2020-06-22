const path = require("path");


module.exports = {
  entry:path.resolve(__dirname,'../src/webapp/createApp.js'),
  output:{
    filename:'createApp-build.js'
  }
}