const koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const static = require('koa-static')
const { createBundleRenderer } = require("vue-server-renderer");
const app = new koa();
let router = new Router();

app.use(static('./dist'));


const template = fs.readFileSync("./dist/index.html", "utf-8");
const bundle = require("./dist/vue-ssr-server-bundle.json");
const manifest = require("./dist/vue-ssr-client-manifest.json");
function createRender(bundle, template, manifest) {
  return createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest:manifest
  });
}
const renderer = createRender(bundle, template, manifest);

const renderData = (context, renderer) => {
  // const context = {
  //   url: ctx.url
  // };
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    });
  });
};

router.get("*", async (ctx, next) => {
  if (!renderer) {
    ctx.type = "html";
    return (ctx.body = "waiting for compilation... refresh in a moment.");
  }
  // ctx.body = 'body'
  let html, status;
  try {
    html = await renderData(ctx, renderer);
  } catch (e) {
    if (e.code === 404) {
      status = 404;
      html = "404 | Not Found";
    } else {
      status = 500;
      html = "500 | Internal Server Error";
      console.error(`error during render : ${ctx.url}`);
    }
  }
  ctx.body = html;

  ctx.type = "html";
  ctx.status = status ? status : ctx.status;

});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log("listening at 3000");
});
