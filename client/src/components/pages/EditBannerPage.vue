<template lang="pug">
    .container
        .row
            .col-xs-12
                h1.page-header
                    | Изменение баннера
                // ---
                BannerItem( edit=true )

</template>

<script>
    import BannerItem from '@/components/BannerItem'

    export default {
        name: 'EditBannerPage',
        components: { BannerItem }
    }
</script>

<style lang="scss" scoped>
    //
</style>