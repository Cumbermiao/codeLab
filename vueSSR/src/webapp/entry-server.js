import {createApp} from "./createApp";

export default function(context) {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();
    const url = context.url;
    router.push(url);
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      console.log("matchedComponents",matchedComponents.length)
      if (!matchedComponents || !matchedComponents.length) {
        return reject({ code: 404 });
      }
      // Promise.all(
      //   matchedComponents.map(component => {
      //     return component.preFetch 
      //   })
      // )
      //   .then(() => {
          resolve(app);
        // })
        // .catch(reject);
    });
  })
}
