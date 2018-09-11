<template>
    <header>
        <nav class="navbar has-shadow is-fixed-top">
            <div class="container">
                <div class="navbar-brand">
                    <router-link to="/" id="header-nav-logo" class="button is-white">LightPoll</router-link>
                    <a role="button" class="navbar-burger is-flex-mobile" data-target="header-nav-menu" aria-label="menu" aria-expanded="false">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="header-nav-menu" class="navbar-menu">
                    <div class="navbar-end">
                        <a class="navbar-item">Register</a>
                        <a class="navbar-item is-hidden-desktop">Login</a>
                        <div class="is-hidden-touch"><a class="button is-success is-outlined is-rounded">Login</a></div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: "Header",
    methods: {
        addNavbarToggleListener: function() {
            const toggles = Array.from(document.getElementsByClassName("navbar-burger"));
            toggles.forEach(el => {
                el.addEventListener("click", () => {
                    const target = el.dataset.target;
                    const targetElement = document.getElementById(target);
                    el.classList.toggle("is-active");
                    targetElement.classList.toggle("is-active");
                });
            });
        }
    },
    mounted: function() {
        this.addNavbarToggleListener();
    }
};
</script>

<style lang="scss" scoped>
header {
    height: 60px;
    box-shadow: 0px 0px 15px #F0F0F0;

    nav {
        height: 60px;

        .container {
            height: 100%;
        }
    }

    .navbar-brand {
        height: 100%;

        #header-nav-logo {
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 32px;
            padding-left: 15px;
            padding-right: 15px;
            border-radius: 0;
            height: 100%;
        }

        .navbar-burger {
            align-items: center;
            height: 100%;
        }
    }

    .navbar-menu {
        .navbar-end {
            display: grid;
            grid-auto-flow: column;
            align-items: center;
            font-weight: 500;
            height: 100%;

            :last-child {
                margin-left: 5px;
            }
        }
    }
}

@media only screen and (max-width: 1100px) {
    #header-nav-menu {
      * {
        text-align: center;
      }
    }
}
</style>