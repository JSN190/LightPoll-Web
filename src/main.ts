import Vue, { ComponentOptions } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.mixin({
    data() {
        return {
            api: process.env.LPW_API
        };
    },
    mounted() {
        console.log(`Using LightPoll API at ${this.api}`);
    }
});

new Vue({
    el: "#app",
    store,
    router,
    components: { App },
    template: "<App/>"
});
