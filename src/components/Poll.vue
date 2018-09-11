<template>
    <main class="container">
        {{ this.$route.params.id }}
        <div class="columns">
            <div class="column  is-two-thirds">
                First column
            </div>
            <div class="column is-one-third">
                Second column
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: "Poll",
    data: {
        name: "",
        description:  "",
        options: []
    },
    mounted: function () {
        //
    }
}
</script>

<style lang="scss" scoped>

</style>


