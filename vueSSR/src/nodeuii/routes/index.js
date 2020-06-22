import { route, GET, POST, before } from "awilix-koa";
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const template = fs.readFileSync("../index.html", "utf-8");
const bundle = require("../vue-ssr-server-bundle.json");
const manifest = require("../vue-ssr-client-manifest.json");

// const renderer = createBundleRenderer(bundle,{
//   template,
//   clientManifest:manifest,
//   runInNewContext:false
// })

@route("/")
// @route("/index.html")
class IndexController {
  constructor({ indexService }) {
    this.indexService = indexService;
  }
  createRender(bundle, template, manifest) {
    return createBundleRenderer(bundle, {
      template,
      clientManifest: manifest,
      runInNewContext: false
    });
  }
  @GET()
  async indexAction(ctx, next) {
    console.log("get", ctx.url);
    const template = fs.readFileSync("../index.html", "utf-8");
    const bundle = require("../vue-ssr-server-bundle.json");
    const manifest = require("../vue-ssr-client-manifest.json");
    const context = {url:ctx.url}
    let renderer = this.createRender(bundle,template,manifest);
    // if (!renderer) {
    //   ctx.type = "html";
    //   ctx.body = "try a few seconds again ...";
    //   return;
    // }
    function render(){
      return new Promise((resolve,reject)=>{
        renderer.renderToString(context, (err, html) => {
          if (err) {
            console.log("err", err);
            switch (err.code) {
              case 404:
                ctx.body = "not found";
                break;
              case 500:
                ctx.body = "something wrong";
                break;
              default:
                return;
            }
          }
          console.log("html", html);
          ctx.body = html;
          ctx.type = "html";
          ctx.status = 200;
          resolve(ctx)
        });
      })
    }
    await render();
    // const result = await this.indexService.getData();

    // ctx.body = result;
  }
}
export default IndexController;
