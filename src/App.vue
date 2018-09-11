<template>
    <div id="app">
        <Header />
        <router-view />
        <Footer />
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
export default {
    name: "App",
    components: {
      Header, Footer
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
</style>
