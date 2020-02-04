import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.mixin({
  data: function() {
    return {
      api: process.env.VUE_APP_LPW_API.replace(/\/$/, ""),
      url: process.env.VUE_APP_LPW_URL.replace(/\/$/, ""),
    };
  },
});

new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App),
});

console.log(process.env);
