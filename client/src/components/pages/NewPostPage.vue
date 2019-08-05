<template lang="pug">
    .container
        .row
            .col-xs-12
                h1.page-header
                    | Добавление группы товаров
                // ---
                GoodsList( edit=false )

</template>

<script>
    import GoodsList from '@/components/GoodsList'

    export default {
        name: 'NewPostPage',
        components: { GoodsList },
    }
</script>

<style lang="scss" scoped>
    //
</style>
