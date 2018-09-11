import Vue from "vue";
import Router from "vue-router";
import Create from "@/components/Create.vue";
import Poll from "@/components/Poll.vue";

Vue.use(Router);

export default new Router({
    routes: [
        { path: "/", component: Create },
        { path: "/poll/:id", component: Poll }
    ]
});
