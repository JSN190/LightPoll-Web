<template>
  <div id="app">
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
    <router-view/>
    <footer>
      <div class="container margin-top-5">
        <div class="divider-10"></div>
        <div id="footer-container">
          <a href="#">About</a>
          &nbsp;•&nbsp;
          <a href="#">Privacy</a>
          &nbsp;•&nbsp;
          <a href="https://github.com/JSN190/LightPoll" target="_blank">GitHub</a>
          &nbsp;•&nbsp;
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted: function () {
    document.addEventListener('DOMContentLoaded', () => {
      const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      if (navbarBurgers.length > 0) {
        navbarBurgers.forEach(el => {
          el.addEventListener('click', () => {
            const target = el.dataset.target;
            const targetElement = document.getElementById(target);
            el.classList.toggle('is-active');
            targetElement.classList.toggle('is-active');
          });
        });
      }
    });
  }
}
</script>

<style lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css');
@import url('https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i');

* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

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

#footer-container {
  padding: 15px 10px 15px 10px;
  font-size: 12px;
  color: #A9A9A9;
  a {
    text-decoration: none;
    color: #A9A9A9;
  }
}
</style>
