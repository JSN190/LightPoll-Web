<template>
    <div id="main-poll-card" class="card">
        <header class="card-header">
            {{ pollName }}
        </header>
        <div class="card-content">
            <form>
                <div class="card-option" v-for="option in options" :key="option.value" v-on:click="selectOption">
                    <div class="pretty p-default p-round">
                        <input type="radio" class="option-radio" name="selected" :value="option.value" v-model="selected">
                        <div class="state p-success">
                            <label for="`form-${option.value}`">{{ option.value }}</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <footer class="card-footer">
            <div v-on:click="submitVote" class="footer-container"><i class="far fa-paper-plane"></i><span>Cast my vote</span></div>
            <div v-on:click="loadingBar.finish()"><router-link :to="`/poll/${$route.params.id}/results`" class="footer-container"><i class="fas fa-table"></i><span>View the results</span></router-link></div>
        </footer>
    </div>
</template>

<script>
export default {
    name: "PollVoting",
    props: {
        pollName: String,
        description: [String, null],
        options: Array,
        loadingBar: Object
    },
    data: function() {
        return {
            selected: null
        }
    },
    methods: {
        selectOption: function(event) {
            if (event.target.nodeName === "DIV") {
                const radio = event.target.getElementsByClassName("option-radio")[0];
                this.selected = radio.value; // v-model does not work with checked
                radio.checked = true;    
            } 
        },
        submitVote: function() {
            this.loadingBar.setPercentage(33);
            fetch(`${this.api}/poll/${this.$route.params.id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    value: this.selected
                })
            }).then(res => res.json())
            .then(data => this.$router.push({name: "PollResults"}))
            .finally(() => this.loadingBar.finish());
        }
    }
}
</script>

<style lang="scss" scoped>
$pretty--color-success: hsl(0, 0%, 60%);
@import '~pretty-checkbox/src/scss/variables';
@import '~pretty-checkbox/src/scss/elements/default/outline';
@import '~pretty-checkbox/src/scss/core';
@import '~pretty-checkbox/src/scss/extras/round';
@import '~pretty-checkbox/src/scss/extras/colors';
@import '~pretty-checkbox/src/scss/extras/animation';


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
        padding: 12px 7.5px 12px 7.5px;
        border-bottom: 1px solid#F0F0F0;

        form {
            display: grid;
            grid-auto-flow: rows;
            grid-gap: 10px;

            .card-option {
                word-break: break-all;
                position: relative;
                overflow: hidden;
                overflow-wrap: break-word;
                height: auto;
                display: grid;

                align-items: center;
                justify-content: flex-start;

                label {
                    font-weight: 500 !important;
                    color: #404040;
                    font-size: 18px;
                }

                padding: 7.5px;
                border-radius: 5px;
                transition: 50ms ease-in-out;
                font-weight: bold;

                &:hover,
                :hover {
                    background-color: rgb(249, 249, 249);
                    cursor: pointer;
                }

                &:active {
                    background-color: #F2F2F2;
                }
            }
        }
    }

    .card-footer {
        display: flex;
        width: 100%;
        height: 50px;
        border-top: 0;

        .footer-container {
            display: grid;
            grid-auto-flow: column;
            grid-gap: 5px;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;

            &:hover {
                background-color: hsl(0, 0%, 98%);
                cursor: pointer;
            }

            &:active {
                background-color: #F5F5F5;
            }

            i {
                color: rgb(223, 223, 223);
                font-size: 13.5px;
            }
        }

        div {
            &:nth-child(n+0) {
                height: 100%;
                width: 100%;
                color: rgb(110, 110, 110);
                font-size: 15.5px;
                transition: 120ms ease-in-out;
            }

            &:nth-child(n+2) {
                border-left: 1px solid #F0F0F0;
            }

            a {
                color: rgb(110, 110, 110);
            }
        }
    }
}

/* 
* Multiline radio/checkbox fix, thanks to lokesh-coder at
* https://github.com/lokesh-coder/pretty-checkbox/issues/25
*/
.pretty {
    white-space: inherit;
    width: 100%;
}

.pretty .state label {
    text-indent: 0;
    padding-left: 2rem;
}

.pretty .state label:after,
.pretty .state label:before {
    top: 0;
}
</style>
