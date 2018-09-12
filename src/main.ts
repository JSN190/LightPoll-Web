import Vue, { ComponentOptions } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.mixin({
    data() {
        return {
            api: process.env.LPW_API
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
