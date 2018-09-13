<template>
    <main class="container">
        <TopLoadingBar />
        <div class="columns">
            <div class="column  is-two-thirds">
                <router-view :pollName="name" :description="description" :options="options"
                :loadingBar="loadingBar"></router-view>
            </div>
            <div class="column is-one-third">
                <section class="connection">
                    <div class="connection-badge">

                        <div><i class="fas fa-circle" :style="`color: ${badgeColours[this.status]}`"></i></div>
                        <div>STREAM {{ this.status.toUpperCase() }}</div>
                        <div class="connection-badge-reconnect" v-if="status === 'Disconnected' || status === 'Error'" v-on:click="streamPoll">reconnect</div>

                    </div>
                    <div class="br-75"></div>
                    <div v-if="status === 'Connected' || status === 'Connecting'">
                        New votes {{ status === "Connected" ? "are" : "will be" }} instantly delivered to your browser in real-time.
                    </div>
                    <div v-if="status === 'Disconnected'">
                        You were disconnected from the real-time stream due to inactivity.
                        <div class="br-25"></div>
                        You can reconnect whenever you're ready.
                    </div>
                    <div v-if="status === 'Error'">
                        An unexpected error has occured during communication with the server. Maybe you could try and connect again.
                    </div>
                </section>
                <section class="poll-info" v-if="name && belongsToRoute">
                    <div class="bold fw-500">Poll Information</div>
                    <div class="br-50"></div>
                    <table>
                        <tr>
                            <td>Created:</td>
                            <td>{{ formatedTimestampes.created }}</td>
                        </tr>
                        <tr>
                            <td>Modified:</td>
                            <td>{{ formatedTimestampes.modified }}</td>
                        </tr>
                        <tr>
                            <td>Latest Vote:</td>
                            <td>{{ totalVotes >= 1 ? formatedTimestampes.latestVote : "No votes yet." }}</td>
                        </tr>

                        <tr>
                            <td>Unique Votes:</td>
                            <td>
                                <div v-if="voters !== 'unlimited'">Enforced&nbsp;<i class="fas fa-lock"></i></div>
                                <div v-if="voters === 'unlimited'">Not Enforced&nbsp;<i class="fas fa-lock-open"></i></div>
                            </td>

                        </tr>
                        <tr>
                            <td>Votes:</td>
                            <td>
                                {{ totalVotes }} total votes
                            </td>
                        </tr>
                    </table>
                </section>
                <section class="poll-info" v-if="name && belongsToRoute">
                    <div class="bold fw-500">Sharing</div>
                    <div class="br-50"></div>
                    Use the following URL to share this poll.
                    <div class="br-50"></div>
                    <div class="link-set">
                        <input type="text" class="sharing-url" v-on:click="shareEventHandler" 
                        v-on:keypress="shareEventHandler" :value="`${url}/poll/${$route.params.id}`" spellcheck="false">
                        <button class="sharing-copy" v-on:click="copyShareUrl">copy</button>
                    </div>
                </section>
            </div>
        </div>
    </main>
</template>

<script>
import randomColor from "randomcolor";
import tinyColor from "tinycolor2";
import TopLoadingBar from "./TopLoadingBar.vue";
import flatLoadingBar from "../common/flat-loading-bar";

function dataSchema() {
    return {
        name: "",
        description: "",
        options: [],
        voters: 0,
        created: null,
        modified: null,
        latestVote: null,
        status: "Connecting",
        belongsToRoute: false,
        stream: null,
        loadingBar: null,
        badgeColours: {
            "Connected": "hsl(141, 65%, 60%)",
            "Connecting": "hsl(48, 100%, 70%)",
            "Disconnected": "hsl(348, 90%, 61%)",
            "Error": "hsl(348, 90%, 61%)",
            "Not Found": "hsl(348, 90%, 61%)"
        }
    }
}

export default {
    name: "Poll",
    components: { TopLoadingBar },
    watch: {
        "$route.params.id"() {
            if (this.stream || this.stream.readyState !== 2) this.stream.close();
            Object.assign(this.$data, dataSchema());
            this.mountLoadingBar();
            this.streamPoll();
        }
    },
    data: function() {
        return dataSchema();
    },
    computed: {
        totalVotes() {
            return this.options.reduce((acc, option) => acc + Number(option.votes), 0);
        },
        formatedTimestampes() {
            return {
                created: this.created ? this.created.toLocaleString()
                    .replace(/:([0-9]){2}$/, "").replace(/[0-9]{4},/, match => match.substring(0, 4)) : null,
                modified: this.modified ? this.modified.toLocaleString()
                    .replace(/:([0-9]){2}$/, "").replace(/[0-9]{4},/, match => match.substring(0, 4)) : null,
                latestVote: this.latestVote ? this.latestVote.toLocaleString()
                    .replace(/:([0-9]){2}$/, "").replace(/[0-9]{4},/, match => match.substring(0, 4)) : null
            };
        }
    },
    methods: {
        votePercentage: function(votes) {
            return votes / (this.totalVotes === 0 ? 1 : this.totalVotes);
        },
        mergeOptions: function(newOptions) {
            for (let newOption of newOptions) {
                let amended = false;
                for (let index in this.options) {
                    if (newOption.value === this.options[index].value) {
                        Object.assign(this.options[index], newOption);
                        amended = true;
                    }
                }
                if (!amended) this.options.push(newOption);
            }
        },
        mountLoadingBar: function() {
            this.loadingBar = flatLoadingBar.getOnly(document, 300);
        },
        shareEventHandler: function(event) {
            event.preventDefault();
            event.target.select();
        },
        copyShareUrl: function(event) {
            navigator.clipboard.writeText(`${this.url}/poll/${this.$route.params.id}`)
            .then(() => event.target.innerText = "copied")
            .catch(() => event.target.innerText = "failed");
            event.target.parentElement.getElementsByClassName("sharing-url")[0].select();
        },
        setPollData: function(pollObject) {
            this.name = pollObject.name;
            this.description = pollObject.description;
            this.created = new Date(pollObject.created);
            this.modified = new Date(pollObject.modified);
            this.latestVote = new Date(pollObject.latestVote);
            this.voters = pollObject.voters ? pollObject.voters : 0;
        },
        streamPoll: async function() {
            try {
                this.status = "Connecting";
                this.loadingBar.setPercentage(33);
                this.stream = new EventSource(`${this.api}/poll/${this.$route.params.id}/stream`);
                this.stream.addEventListener("current", event => {
                    setTimeout(() => this.status = "Connected", 500);
                    this.belongsToRoute = true;
                    const data = JSON.parse(event.data);
                    this.setPollData(data);
                    this.options = data.options;
                    this.loadingBar.finish(400);
                });
                this.stream.addEventListener("vote", event => {
                    let data = JSON.parse(event.data);
                    data = Object.assign(JSON.parse(event.data), { poll: JSON.parse(data.poll) });
                    this.setPollData(data.poll);
                    this.mergeOptions(data.poll.options);
                });
                this.stream.addEventListener("timeout", () => {
                    this.stream.close();
                    this.status = "Disconnected";
                    this.loadingBar.finish();
                });
                this.stream.addEventListener("error", event => {
                    this.stream.close();
                    this.status = event.data ? event.data.includes("not found") ? "Not Found" : "Error" : "Error";
                    this.loadingBar.finish();
                });
            } catch (e) {
                this.status = "Error";
                this.loadingBar.finish();
            }
        }
    },
    mounted: function() {
        this.mountLoadingBar();
        this.streamPoll();
    }
};
</script>

<style lang="scss" scoped>
main {
    padding: 25px 0px 25px 0px;

    .columns:nth-child(2) {
        section {
            font-size: 14px;
            margin-bottom: 10px;
        }
    }

    .connection {
        .connection-badge {
            display: grid;
            grid-auto-flow: column;
            grid-gap: 7.5px;
            width: 100%;
            align-items: center;
            justify-content: flex-start;
            font-size: 14px;
            letter-spacing: 2px;
            color: #696969;
            line-height: 20px;

            .connection-badge-reconnect {
                font-size: 10px;
                line-height: 0;
                text-decoration: underline;
                text-decoration-style: dotted;
                color: #696969;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

    .poll-info {
        table {
            width: 100%;
            display: grid;
            grid-auto-flow: row;
            grid-gap: 2px;
            font-size: 14px;
            font-weight: 300;

            tr {
                width: 100%;
                display: grid;
                grid-auto-flow: column;
                grid-template-columns: 2fr 3fr;

                td {
                    display: grid;
                    grid-auto-flow: column;
                    justify-content: flex-start;

                    &:first-child {
                        font-weight: 400;
                    }
                }
            }
        }
    }

    .link-set {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 7.5px;
        justify-content: flex-start;
        align-items: center;
    }

    .sharing-url {
        border: 1px dotted #cecece;
        border-radius: 5px;
        color: #848484;
        font-size: 12px;
        padding: 2px;
        overflow: hidden;

        &::selection {
            background-color: #caf8ff83;
        }

        outline: none;
    }

    .sharing-copy {
        border: 0;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        background-color: #F4F4F4;
        padding: 2px 5px 3px 5px;
        font-size: 11px;
        text-decoration-style: dotted;
        color: #959595;

        &:hover {
            cursor: pointer;
            background-color: #EDEDED;
        }

        &:active {
            background-color: #E0E0E0;
        }

        &:focus {
            outline: none;
        }

        align-content: center;
        transition: background-color 100ms ease-in-out;
    }

    .fas {
        color: #d6d6d6;
    }
}

@media only screen and (max-width: 1100px) {
    main {
        padding: 25px 25px 25px 25px;
    }
}
</style>


