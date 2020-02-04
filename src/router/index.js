import Vue from "vue";
import Router from "vue-router";
import Create from "../components/Create.vue";
import Poll from "../components/Poll.vue";
import PollVoting from "../components/PollVoting.vue";
import PollResults from "../components/PollResults.vue";

Vue.use(Router);

export default new Router({
  mode: process.env.VUE_APP_LPW_HIST === "1" ? "history" : "hash",
  routes: [
    { path: "/", component: Create, name: "Create" },
    {
      path: "/poll/:id",
      component: Poll,
      children: [
        {
          path: "",
          component: PollVoting,
          name: "PollVoting",
        },
        {
          path: "results",
          component: PollResults,
          name: "PollResults",
        },
      ],
    },
  ],
});
