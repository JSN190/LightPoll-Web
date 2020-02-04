<template>
  <header>
    <nav class="navbar is-fixed-top">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-logo-container">
            <router-link to="/" id="header-nav-logo" class="logo"
              ><i class="fas fa-bolt"></i>&nbsp;LightPoll</router-link
            >
          </div>
          <!--<a
            role="button"
            class="navbar-burger is-flex-mobile"
            data-target="header-nav-menu"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>-->
        </div>
        <!--<div id="header-nav-menu" class="navbar-menu">
                    <div class="navbar-end">
                        <a class="navbar-item">Register</a>
                        <a class="navbar-item is-hidden-desktop">Login</a>
                        <div class="is-hidden-touch"><a class="button is-outlined">Login</a></div>
                    </div>
                </div>-->
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  methods: {
    addNavbarToggleListener: function() {
      const toggles = Array.from(
        document.getElementsByClassName("navbar-burger"),
      );
      toggles.forEach(el => {
        el.addEventListener("click", () => {
          const target = el.dataset.target;
          const targetElement = document.getElementById(target);
          el.classList.toggle("is-active");
          targetElement.classList.toggle("is-active");
        });
      });
    },
  },
  mounted: function() {
    this.addNavbarToggleListener();
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Arimo");

header {
  height: 75px;

  nav {
    height: 75px;

    .container {
      height: 100%;
    }
  }

  .navbar-brand {
    height: 100%;

    .navbar-logo-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #header-nav-logo {
      font-family: "Arimo";
      font-size: 24px;
      font-weight: 700;
      color: #686868;
      padding: 5px;
      border-radius: 5px;
      margin-left: 10px;
      &:hover {
        background-color: rgb(249, 249, 249);
      }
      &:active {
        background-color: rgb(245, 245, 245);
      }
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
