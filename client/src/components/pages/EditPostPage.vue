<template lang="pug">
    section.edit
        .container
            .row
                .col-xs-12
                    h1.page-header
                        | Изменение группы товаров
                    // ---
                    GoodsList( edit=true )
</template>

<script>
    import GoodsList from '@/components/GoodsList'

    export default {
        name: 'EditPostPage',
        components: { GoodsList },
    }
</script>

<style lang="scss" scoped>
    //
</style>
