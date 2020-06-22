const Koa = require("koa");
const { Lifetime, createContainer } = require("awilix");
const { loadControllers, scopePerRequest } = require("awilix-koa");
const static = require("koa-static");
// const {createBundleRenderer} = require("vue-server-renderer")
// const template = require('./index.html')
// const bundle = require('./vue-ssr-server-bundle.json')
// const manifest = require('./vue-ssr-client-manifest.json')

// const createRender = (bundle,template,manifest)=>{
//   return createBundleRenderer(bundle,{
//     template,
//     clientManifest:manifest,
//     runInNewContext:false
//   })
// }
const app = new Koa();
const container = createContainer();

container.loadModules([__dirname + "/service/*.js"], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SCOPED
  }
});
app.use(scopePerRequest(container));

app.use(loadControllers("./routes/*.js", { cwd: __dirname }));
app.use(static('/routes'))

app.listen(3000,()=>{
  console.log("at port 3000")
});
