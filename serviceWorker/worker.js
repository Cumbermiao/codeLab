console.log("I am a Service Worker");

this.addEventListener('install', function(e) {
  console.log("workerJS have been installed");
  e.waitUntil(
    caches.open('serviceworker-simple').then((cache)=>{
        console.log('cache',cache)
    })
  )
});

this.addEventListener('activate', function(e) {
  console.log("I am a Service Worker and I have been activated");
});

var a = 'change worker';