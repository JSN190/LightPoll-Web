import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.mixin({
    data: function() {
        return {
            api: process.env.LPW_API.replace(/\/$/, ""),
            url: process.env.LPW_URL.replace(/\/$/, "")
        };
    }
});

new Vue({
    el: "#app",
    store,
    router,
    components: { App },
    template: "<App/>"
});
