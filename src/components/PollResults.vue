<template>
    <div id="main-poll-card" class="card">
        <header class="card-header">
            {{ pollName }}
        </header>
        <div class="card-content">
            <div class="card-option" v-for="option in localOptions" :key="option.value">
                <header>
                    <span class="option-value">{{ option.value }}</span>
                </header>
                <div class="option-votes-bar">
                    <div class="option-votes-bar-share" :data-width="`${(votePercentage(option.votes) * 100)}%`" :style="`background-color: ${option.votes ? option.colour : '#F0F0F0'};`">
                        <div class="options-votes-bar-percent">{{ (votePercentage(option.votes) * 100).toFixed(0) }}%</div>
                    </div>
                </div>
                <div class="option-votes">
                    {{ option.votes > 0 ? option.votes + (option.votes > 1 ? " people" : " person") + " voted for this option." : "Nobody has voted for this option yet." }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import randomColor from "randomcolor";
import tinyColor from "tinycolor2";
import TopLoadingBar from "./TopLoadingBar.vue";
import flatLoadingBar from "../common/flat-loading-bar";

export default {
    name: "PollResults",
    props: {
        pollName: String,
        description: String,
        options: Array,
        loadingBar: Object
    },
    data: function() {
        return {
            localOptions: []
        }
    },
    computed: {
        totalVotes() {
            return this.localOptions.reduce((acc, option) => acc + Number(option.votes), 0);
        }
    },
    watch: {
        options: {
            deep: true,
            immediate: true,
            handler() {
                this.respond();
            }
        }
    },
    methods: {
        votePercentage: function(votes) {
            return votes / (this.totalVotes === 0 ? 1 : this.totalVotes);
        },
        assignOptionColours: function(reset) {
            let colours = new Set();
            this.localOptions.forEach((option, index) => {
                do { colours.add(randomColor({ luminosity: "bright" })); } while (colours.size < index + 1);
                if (!option.hasOwnProperty("colour") || reset) option.colour = Array.from(colours)[index];
            });
        },
        animateVoteBars: function(delay = 100) {
            setTimeout(() => {
                const bars = Array.from(document.getElementsByClassName("option-votes-bar-share"));
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        const label = bar.getElementsByClassName("options-votes-bar-percent")[0];
                        label.style.setProperty("color", `${tinyColor(bar.style.getPropertyValue("background-color")).isLight() ? "black" : "white"}`);
                        bar.style.setProperty("width", bar.dataset.width);
                    }, (index + 1) * delay);
                });
            }, 50);
        },
        respond: function(resetColours) {
            this.localOptions = Object.create(this.options);
            this.localOptions.sort((a, b) => b.votes - a.votes);
            this.assignOptionColours(resetColours);
            this.animateVoteBars();
        }
    },
    mounted: function() {
        this.$nextTick(() => this.respond(true));
    }
}
</script>

<style lang="scss" scoped>
#main-poll-card {
    border: 0.5px solid #F0F0F0;
    border-radius: 4px;
    box-shadow: 1px 1px 10px #F0F0F0;

    .card-header {
        padding: 10px 15px 10px 15px;
        font-size: 30px;
        font-weight: 500;
        color: #181818;
    }

    .card-content {
        display: grid;
        grid-auto-flow: rows;
        grid-gap: 5px;
        padding: 10px 15px 20px 15px;

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
                border-radius: 12px;
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
</style>
