<template>
    <main class="container">
        <div class="columns">
            <div class="column is-two-thirds">
                <div id="main-poll-form-card" class="card">
                    <form id="main-poll-form">
                        <header class="card-header">
                            <textarea id="main-poll-form-name" class="140char" rows="1" maxlength="140" v-model="name" placeholder="Enter your question here..."></textarea>
                        </header>
                        <div class="card-content">
                            <textarea v-for="index in (options.length + 1)" class="main-poll-form-option 140char" rows="1" maxlength="140" :key="index - 1"
                                v-model="options[index-1]" :placeholder="optionPlaceholder(index - 1)"></textarea>
                        </div>
                        <div id="main-poll-errors" v-if="errors.length > 0">
                            <div class="accordions">
                                <div class="accordion" id="accordion-validation-error">
                                    <div class="accordion-header toggle" v-on:click="accordionClick">
                                        <p>{{ errors.length }} error{{errors.length > 1 ? 's' : '' }}.</p>
                                        <span class="icon is-small">
                                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <div class="accordion-body">
                                        <div class="accordion-content">
                                            <div v-for="error in errors" :key="error">
                                                <span class="icon has-text-warning">
                                                    <i class="fas fa-exclamation-triangle"></i>
                                                </span>
                                                {{ error }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <div>
                                <a id="main-poll-create" class="button is-success is-outlined is-rounded" v-on:click="sendPollAndRetrieveId">
                                    Create Poll
                                </a>
                            </div>
                            <div id="main-poll-checkbox-group">
                                <label class="checkbox">
                                    <input type="checkbox" v-model="anonymous"> Post anonymously
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" v-model="enforceUnique"> Prevent duplicate votes
                                </label>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
            <div class="column is-one-third">
                <p class="is-size-5 fw-500">What is LightPoll?</p>
                <div class="br-50"></div>
                <p>LightPoll allows you to instantaneosly create and share online polls without registration.</p>
                <div class="br-25"></div>
                <p>It is a free and open source software project released under the MIT License.</p>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import validator from "validator";
import autosize from "autosize";

function getDefaultData() {
    return {
        name: null,
        options: [],
        anonymous: true,
        enforceUnique: false,
        errors: []
    };
}

export default {
    name: "Create",
    data: getDefaultData,
    methods: {
        optionPlaceholder: function(index) {
            if (index === 0) return "And then enter an option...";
            else if (index === 1) return "And now another...";
            return "And maybe another...";
        },
        setCharRestrictEffects: function() {
            const elements = Array.from(document.getElementsByClassName("140char")) as Array<HTMLElement>;
            for (let element of elements) {
                autosize(element);
                element.addEventListener("keydown", event => {
                    const element: HTMLInputElement = event.target as HTMLInputElement;
                    if (element.value.length >= 140) {
                        element.style.setProperty("color", "deeppink");
                        setTimeout(() => element.style.removeProperty("color"), 500);
                    }
                });
            }
        },
        accordionClick: function() {
            const errorAccordion = document.getElementById("accordion-validation-error") as HTMLElement;
            errorAccordion.classList.toggle("is-active");
        },
        flushAndPushErrors: function() {
            let errors = new Set(),
                uniqueOptions = [];
            const emptyOptions = this.options.reduce((acc, e) => String(e).trim().length < 1 ? acc + 1 : acc, 0);
            const nonEmptyOptions = this.options.filter(e => String(e).trim().length >= 1);

            if (!this.name) errors.add("This poll needs a name.");
            if (this.name && !validator.isAscii(this.name)) errors.add("Unacceptable characters in name.");
            if (this.name && this.name.length > 140) errors.add("The poll name is too long.");
            if (nonEmptyOptions.length < 2) errors.add("This poll needs at least two options.");
            if (emptyOptions === this.options.length) errors.add("All options are empty.");
            for (let option of this.options) {
                option = String(option);
                if (option.length >= 1 && !validator.isAscii(option)) errors.add("Unacceptable characters in one or more options.");
                if (option.length > 140) errors.add("One or more options is too long.");
                if (option.length >= 1 && uniqueOptions.includes(option)) errors.add("Options must be unique.");
                if (option.length >= 1 && !uniqueOptions.includes(option)) uniqueOptions.push(option);
            }
            this.errors = Array.from(errors);
        },
        sendPollAndRetrieveId: async function (event) {
            try {
                event.target.classList.add("is-loading");
                this.flushAndPushErrors();
                if (this.errors.length > 0) {
                    setTimeout(() => event.target.classList.remove("is-loading"), 200);
                    return;
                }
                const response = await fetch("http://localhost:3000/poll", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: this.name,
                        options: this.options.filter(e => String(e).trim().length >= 1),
                        enforceUnique: this.enforceUnique,
                        anonymous: this.anonymous
                    })
                })
                const data = await response.json();
                this.$router.push({ path: `/poll/${data.poll_id}` });
                Object.assign(this.$data, getDefaultData());
            } catch (e) {
                console.error(e);
                this.errors.push("There was an error submitting your poll.");
            } finally {
                setTimeout(() => event.target.classList.remove("is-loading"), 200)
            }
        }
    },
    watch: {
        "options.length": function() {
            this.setCharRestrictEffects();
        }
    },
    mounted: function() {
        this.setCharRestrictEffects();
    }
};
</script>

<style lang="scss" scoped>
@import "~bulma-extensions/bulma-accordion/dist/css/bulma-accordion.min.css";
main {
    padding: 25px 0px 25px 0px;
    #main-poll-form-card {
        border: 0.5px solid #F0F0F0;
        border-radius: 4px;
        box-shadow: 1px 1px 10px #F0F0F0;
        overflow: hidden;
        .card-header {
            height: auto;
            textarea {
                height: auto;
                width: 100%;
                border: none;
                outline: none;
                overflow: auto;
                resize: none;
                padding: 10px;
                font-size: 30px;
                font-weight: 500;
                color: #181818;
                &::placeholder {
                    color: #A9A9A9;
                }
            }
        }
        .card-content {
            line-height: 0;
            padding: 1px 0 0 0;
            .main-poll-form-option {
                height: auto;
                width: 100%;
                border: none;
                outline: none;
                overflow: auto;
                resize: none;
                padding: 10px;
                font-size: 25px;
                color: #181818;
                border-bottom: 0.5px solid #F0F0F0;
                &::placeholder {
                    color: #A9A9A9;
                }
            }
        }
        #main-poll-errors{
             padding:3px 7px 3px 7px;
             border-bottom: 0.5px solid #F0F0F0;;
            .accordion-header {
                border-radius: 0;
                background-color: white;
                color: #ff2861;
            }
            .accordion-body {
                border-bottom: 0;
                background-color: white;
                border: 0;
                .accordion-content {
                    border: 0.5px solid #F9FAF9;
                    border-radius: 7.5px;
                    padding: 5px 10px 5px 10px;
                    margin: 0px 10px 7px 10px;
                    border-bottom: 1px solid #F0F0F0;
                    background-color: #FDFDFD;
                }
            }

        }
        .card-footer {
            border-top: 0;
            padding: 15px 15px 15px 15px;
            display: grid;
            grid-auto-flow: column;
            justify-content: flex-start;
            grid-gap: 15px;
            #main-poll-checkbox-group {
                display: grid;
                grid-auto-flow: column;
                grid-gap: 10px;
                justify-content: flex-start;
                align-items: center;
            }
        }
    }
}

@media only screen and (max-width: 1100px) {
    main {
        padding: 25px 25px 25px 25px;
    }
}

@media only screen and (max-width: 550px) {
    main {
        #main-poll-form-card {
            .card-footer {
                display: flex;
                -webkit-flex-flow: column-reverse;
                flex-flow: column-reverse;
                #main-poll-checkbox-group {
                    grid-auto-flow: row;
                    grid-gap: 12px;
                    margin-bottom: 15px;
                }
            }
        }
    }
}
</style>
