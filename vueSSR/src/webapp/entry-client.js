import { createApp } from './createApp'

// 客户端特定引导逻辑……

const { app,router } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(()=>{
  app.$mount('#app')
})
router.onError((err)=>{
  console.log('router error',err)
})