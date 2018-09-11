<template>
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
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style lang="scss" scoped>
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