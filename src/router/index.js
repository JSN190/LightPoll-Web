import Vue from 'vue'
import Router from 'vue-router'
import Create from "@/components/Create.vue"

Vue.use(Router)

export default new Router({
  routes: [
    { path: "/", component: Create }
  ]
})
