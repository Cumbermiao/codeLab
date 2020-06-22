import Router from "vue-router";
import Vue from 'vue';
import App from "../App.vue";
import Test from "../pages/Test/Test.vue";
import Home from '../pages/Home/Home.vue'
Vue.use(Router)

const createRouter = function() {
  return new Router({
    mode:'history',
    routes: [{ path: "/", component: Home }, { path: "/test", component: Test }]
  });
};

export default createRouter;
