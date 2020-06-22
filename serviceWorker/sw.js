let cacheVersion = "react-v1";
let cacheFiles = ["js/index.js", "css/index.css", "/"];

this.addEventListener("install", function(e) {
  //直接进入 activate 阶段
  console.log('installss')
  e.waitUntil(this.skipWaiting());
});

this.addEventListener("activate", function(e) {
  // e.waitUntil(caches.open("react-project").then(cache => {
  //   return cache.addAll(['/sw.js'])
  // }));
  console.log('activatedsd')
});


this.addEventListener("fetch",function(e){
  console.log('fetch',e)
})
console.log('last')