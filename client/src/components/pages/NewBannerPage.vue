<template lang="pug">
    .container
        .row
            .col-xs-12
                h1.page-header
                    | Добавление баннера
                // ---
                BannerItem( edit=false )

</template>

<script>
    import BannerItem from '@/components/BannerItem'

    export default {
        name: 'NewBannerPage',
        components: { BannerItem }
    }
</script>

<style lang="scss" scoped>
    //
</style>