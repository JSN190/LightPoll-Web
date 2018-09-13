import Vue from "vue";
import { default as Vuex, mapActions } from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userToken: null,
        pollEditTokens: {}
    },
    mutations: {
        setUserToken(state, token) {
            state.userToken = token;
        },
        addEditToken(state, payload) {
            state.pollEditTokens[String(payload.pollId)] = {
                token: payload.token,
                datetime: Date.now(),
            };
        },
        removeEditToken(state, pollId) {
            delete state.pollEditTokens[pollId];
        },
    },
    actions: {
        ...mapActions(["setUserToken", "addEditToken", "removeEditToken"]),
    },
    plugins: [createPersistedState()],
});
