<template>
  <footer>
    <div class="container margin-top-5">
      <div class="divider-10"></div>
      <div id="footer-container">
        <a href="#">About</a>
        &nbsp;•&nbsp;
        <a href="https://github.com/Tyncture/LightPoll-web/issues"
          >Issue Tracker</a
        >
        &nbsp;•&nbsp;
        <a href="https://github.com/Tyncture/LightPoll" target="_blank"
          >GitHub</a
        >
        &nbsp;•&nbsp;
        <a href="#">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
#footer-container {
  padding: 15px 10px 15px 10px;
  font-size: 12px;
  color: #a9a9a9;

  a {
    text-decoration: none;
    color: #a9a9a9;
  }
}
</style>
