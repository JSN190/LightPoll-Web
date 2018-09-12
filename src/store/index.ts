import Vue from "vue";
import { default as Vuex, mapActions } from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

interface IEditTokenPayload {
    pollId: number | string;
    token: string;
}

class State {
    public userToken: string;
    public pollEditTokens: object;
    constructor() {
        this.userToken = "";
        this.pollEditTokens = new Object();
    }
}

export default new Vuex.Store({
    state: new State(),
    mutations: {
        setUserToken(state, tokenString: string) {
            state.userToken = tokenString;
        },
        addEditToken(state, payload: IEditTokenPayload) {
            state.pollEditTokens[String(payload.pollId)] = {
                token: payload.token,
                datetime: Date.now(),
            };
        },
        removeEditToken(state, pollId: number) {
            delete state.pollEditTokens[pollId];
        },
    },
    actions: {
        ...mapActions(["setUserToken", "addEditToken", "removeEditToken"]),
    },
    plugins: [createPersistedState()],
});
