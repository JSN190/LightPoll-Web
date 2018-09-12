<template>
    <main class="container">
        <TopLoadingBar />
        <div class="columns">
            <div class="column  is-two-thirds">
                <div id="main-poll-card" class="card" v-if="name && belongsToRoute">
                    <header class="card-header">
                        {{ name }}
                    </header>
                    <div class="card-content">
                        <div class="card-option" v-for="option in options" :key="option.value">
                            <header>
                                <span class="option-value">{{ option.value }}</span>
                            </header>
                            <div class="option-votes-bar">
                                <div class="option-votes-bar-share" :data-width="`${(votePercentage(option.votes) * 100)}%`" :style="`background-color: ${option.votes ? option.colour : '#F0F0F0'};`">
                                    <div class="options-votes-bar-percent">{{ (votePercentage(option.votes) * 100).toFixed(0) }}%</div>
                                </div>
                            </div>
                            <div class="option-votes">
                                {{ option.votes > 0 ? option.votes + " people voted for this option." : "Nobody has voted for this option yet." }}
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                    </footer>
                </div>
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
                    <div class="is-size-5 fw-500">Poll Information</div>
                    <div class="br-75"></div>
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
                            <td>{{ formatedTimestampes.latestVote }}</td>
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
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import randomColor from "randomcolor";
import tinyColor from "tinycolor2";
import TopLoadingBar from "./TopLoadingBar.vue";
import flatLoadingBar from "../common/flat-loading-bar";

function getDataDefaults() {
    return {
        name: "",
        description: "",
        options: [],
        voters: null,
        created: null,
        latestVote: null,
        modified: null,
        loadingBar: null,
        stream: null,
        status: "Connecting",
        belongsToRoute: true,
        badgeColours: {
            "Connected": "hsl(141, 65%, 60%)",
            "Connecting": "hsl(48, 100%, 70%)",
            "Disconnected": "hsl(348, 90%, 61%)",
            "Error": "hsl(348, 90%, 61%)",
            "Not Found": "hsl(348, 90%, 61%)"
        }
    };
}

export default {
    name: "Poll",
    components: { TopLoadingBar },
    watch: {
        "$route.params.id"() {
            if (this.stream || this.stream.readyState !== 2) this.stream.close();
            Object.assign(this.$data, getDataDefaults());
            this.mountLoadingBar();
            this.streamPoll();
        }
    },
    data: getDataDefaults,
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
        assignOptionColours: function() {
            let colours = new Set();
            this.options.forEach((option, index) => {
                do { colours.add(randomColor({ luminosity: "bright" })); } while (colours.size < index + 1);
                if (!option.hasOwnProperty("colour")) option.colour = Array.from(colours)[index];
            });
        },
        animateVoteBars: function(delay = 400) {
            setTimeout(() => {
                const bars: Array < HTMLElement > = Array.from(document.getElementsByClassName("option-votes-bar-share")) as Array < HTMLElement > ;
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        const label: HTMLElement = bar.getElementsByClassName("options-votes-bar-percent")[0] as HTMLElement;
                        console.log(label)
                        label.style.setProperty("color", `${tinyColor(bar.style.getPropertyValue("background-color")).isLight() ? "black" : "white"}`);
                        bar.style.setProperty("width", bar.dataset.width);
                    }, (index + 1) * delay);
                });
            }, 50);

        },
        mergeOptions: function(newOptions) {
            console.log(newOptions);
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
        sortOptions: function() {
            this.options.sort((a, b) => {
                if (a.votes > b.votes) return 1;
                else if (a.values < b.votes) return -1;
                else return 0;
            });
        },
        mountLoadingBar: function() {
            this.loadingBar = flatLoadingBar.getOnly(document, 300);
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
                this.stream = new EventSource(`http://localhost:3000/poll/${this.$route.params.id}/stream`);
                this.stream.addEventListener("current", event => {
                    setTimeout(() => this.status = "Connected", 500);
                    this.belongsToRoute = true;
                    const data = JSON.parse(event.data);
                    this.setPollData(data);
                    this.options = data.options;
                    this.sortOptions();
                    this.assignOptionColours();
                    this.animateVoteBars();
                    this.loadingBar.finish(400);
                });
                this.stream.addEventListener("vote", event => {
                    let data = JSON.parse(event.data);
                    data = Object.assign(JSON.parse(event.data), { poll: JSON.parse(data.poll) });
                    this.setPollData(data.poll);
                    this.mergeOptions(data.poll.options);
                    this.sortOptions();
                    this.animateVoteBars();
                });
                this.stream.addEventListener("timeout", () => {
                    this.stream.close();
                    this.status = "Disconnected";
                    this.loadingBar.finish(400);
                });
                this.stream.addEventListener("error", event => {
                    this.stream.close();
                    this.status = event.data ? event.data.includes("not found") ? "Not Found" : "Error" : "Error";
                    this.loadingBar.finish(400);
                });
            } catch (e) {
                this.status = "Error";
                this.loadingBar.finish(400);
            }
        }
    },
    mounted: function() {
        this.mountLoadingBar();
        this.streamPoll();
        const unused = 434;
    }
};
</script>

<style lang="scss" scoped>
main {
    padding: 25px 0px 25px 0px;

    #main-poll-card {
        border: 0.5px solid #F0F0F0;
        border-radius: 4px;
        box-shadow: 1px 1px 10px #F0F0F0;


        .card-header {
            padding: 10px 15px 10px 15px;
            font-size: 24px;
            font-weight: 500;
            color: #181818;
        }

        .card-content {

            display: grid;
            grid-auto-flow: rows;
            grid-gap: 5px;
            padding: 10px 15px 10px 15px;

            .card-option {
                header {
                    padding-left: 5px;
                    font-size: 20px;
                    color: #404040;
                    font-weight: 500;

                }

                .option-votes-bar {
                    margin-top: 5px;
                    height: 27.5px;
                    width: 100%;
                    border-radius: 1px;
                    box-sizing: content-box;
                    background-color: #F0F0F0;
                    overflow: hidden;
                    line-height: 0px;

                    .option-votes-bar-share {
                        display: flex;
                        align-items: center;
                        width: 0;
                        height: 100%;
                        border-radius: 12px;
                        transition: 300ms ease-in;
                    }

                    .options-votes-bar-percent {
                        position: relative;
                        left: 17.5px;
                        font-size: 14px;
                        font-weight: 500;
                        transition: 500ms ease-in;
                    }
                }

                .option-votes {
                    margin-top: 5px;
                    padding-left: 5px;
                    font-size: 14px;
                    color: #808080;

                }
            }

        }
    }

    .connection {
        margin-bottom: 10px;

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
}

@media only screen and (max-width: 1100px) {
    main {
        padding: 25px 25px 25px 25px;
    }
}
</style>


