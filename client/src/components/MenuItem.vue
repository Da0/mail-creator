<template lang="pug">
    tr
        td
            input.form-control(v-model="item.title", v-bind:id="'item-title-'+index", placeholder="Заголовок")
        td
            input.form-control(v-model="item.link", v-bind:id="'item-link-'+index", placeholder="Ссылка")
        td.text-center
            label(v-bind:for="'item-sale-'+index")
                input.checkbox(type="checkbox", v-model="item.sale", v-bind:id="'item-sale-'+index", title="Распродажа")
        td.text-center
            button.btn.btn-sm.btn-danger(type="button", @click="removeItem", title="Удалить пункт меню")
                i.glyphicon.glyphicon-trash

</template>

<script>
    export default {
        name: "MenuItem",
        // data: function() {
        //     return {
        //
        //     }
        // },
        props: {
            item: {
                type: Object,
                required: true
            },
            index: Number
        },
        methods: {
            removeItem: function () {
                this.$emit('remove', this.index);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table {
        > tbody > tr > td {
            vertical-align: middle;
            line-height: 1;
            label {
                margin-bottom: 0;
            }
        }
        .form-control {
            min-width: 175px;
        }
    }
</style>