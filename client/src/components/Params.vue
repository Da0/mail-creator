<template lang="pug">
    form.panel.panel-success( v-on:submit.prevent="saveParams" )
        h4.panel-heading( style="cursor: pointer;", @click="toggleOpen" ) Настройки&nbsp;
            i.glyphicon( v-bind:class="{ 'glyphicon-triangle-top': isOpen, 'glyphicon-triangle-bottom': !isOpen }", style="top: 3px;" )
        .panel-body.form-horizontal( v-if="isOpen" )
            .form-group.text-left
                label.col-sm-2.control-label( for="heading" ) Тема письма
                .col-sm-10
                    input.form-control( id="heading", type="text", placeholder="Тема письма", v-model.trim="params.heading" )
            .form-group.text-left
                label.col-sm-2.control-label( for="mainLink" ) Главная ссылка
                .col-sm-10
                    input.form-control( id="mainLink", type="url", placeholder="https://www.example.com/sale/", v-model.trim="params.mainLink" )
            .form-group.text-left
                label.col-sm-2.control-label( for="domain" ) Домен
                .col-sm-10
                    input.form-control( id="domain", type="text", placeholder="www", v-model.trim="params.domain" )
            .form-group.text-left
                label.col-sm-2.control-label( for="hiddenText" )
                    abbr( title="Скрытый текст" ) Прехедер
                .col-sm-10
                    textarea.form-control( id="hiddenText", rows="5", placeholder="Скрытый текст", v-model.trim="params.hiddenText" )
            .form-group.text-left
                .col-sm-10.col-sm-push-2.checkbox
                    label
                        input( type="checkbox", name="mainBtn", v-model="params.mainBtn" )
                        | Главная кнопка
            .form-group.text-left( v-if="params.mainBtn" )
                label.col-sm-2.control-label( for="mainBtnText" ) Текст кнопки
                .col-sm-10
                    input.form-control( type="text", id="mainBtnText", placeholder="На распродажу", v-model.trim="params.mainBtnText" )
            .form-group.text-left
                label.col-sm-2.control-label(for="primary") Цвет ссылок, кнопок
                .col-sm-10
                    .input-group
                        input.form-control( v-bind:type="primaryInput", id="primary", name="primary", v-model="params.primary", placeholder="#337ab7" )
                        span.input-group-addon.color-toggle( v-on:click.stop="togglePrimaryInput" )
                            i.glyphicon.glyphicon-pencil
            .form-group.text-left
                label.col-sm-2.control-label(for="bodyBg") Цвет фона
                .col-sm-10
                    .input-group
                        input.form-control( v-bind:type="bgInput", id="bodyBg", name="bodyBg", v-model="params.bodyBg", placeholder="#e6e7e8" )
                        span.input-group-addon.color-toggle( v-on:click.stop="toggleBgInput" )
                            i.glyphicon.glyphicon-pencil
            .form-group.text-left
                label.col-sm-2.control-label
                    abbr( title="Вариант кнопок, карточек" ) Тема
                .col-sm-10
                    label.radio-inline
                        input( type="radio", name="postVariant", value="1", v-model="params.cardVariant" )
                        | Вариант №1

                    label.radio-inline
                        input( type="radio", name="postVariant", value="2", v-model="params.cardVariant" )
                        | Вариант №2

            .form-group.text-left
                label.col-sm-2.control-label Меню
                .col-sm-10
                    p
                        label.radio-inline
                            input( type="radio", name="menuType", value="default", v-model="params.menuType" )
                            | Сверху

                        label.radio-inline
                            input( type="radio", name="menuType", value="bottom", v-model="params.menuType" )
                            | Снизу

                    div.table-responsive
                        table.table.table-bordered.table-hover(width="100%")
                            thead
                                tr
                                    th Заголовок
                                    th Ссылка
                                    th(width="1%") Выделить
                                    th(width="1%") Удалить
                            tbody
                                MenuItem(v-for="(n, index) in params.catalog", :item="n", :index="index", :key="n.id", v-on:remove="removeMenuItem")

                    button.btn.btn-info( type="button", @click="addMenuItem")
                        i.glyphicon.glyphicon-plus
                        | &nbsp;Добавить пункт меню

            .form-group.text-left
                .col-sm-10.col-sm-push-2.checkbox
                    label.checkbox-inline
                        input( type="checkbox", name="ugly", v-model="params.ugly" )
                        abbr( title="Выключить, если в сгенерированный файл нужно внести правки" ) Сжатый HTML
                    label.checkbox-inline
                        input( type="checkbox", name="greetings", v-model="params.greetings" )
                        abbr( title="Здравствуйте, username" ) Приветствие

            transition( name="slide-fade" )
                .bg-success( v-if="saved" )
                    i.glyphicon.glyphicon-ok-circle
                    | &nbsp;Сохранено

        .panel-footer( v-if="isOpen" )
            button.btn.btn-primary( type="submit" )
                i.glyphicon.glyphicon-floppy-disk
                | &nbsp;Сохранить
</template>

<script>
    import ParamsService from '@/services/ParamsService'
    import MenuItem from '@/components/MenuItem'

    let nextItemId = 1;

    export default {
        name: "Params",
        data: function() {
            return {
                bgInput: 'text',
                primaryInput: 'text',
                params: {},
                saved: false,
                isOpen: localStorage.getItem('isOpen') !== null ? localStorage.getItem('isOpen') === 'true' : false,
                config: require('../../../server/src/config/config')
            }
        },
        components: { MenuItem },
        methods: {
            async getParams() {
                const response = await ParamsService.fetchParams();
                let ids = [];

                this.params = response.data.params;
                this.params.catalog.forEach(function(item) {
                    ids.push(item.id);
                });

                if (ids.length) {
                    nextItemId = Math.max.apply(null, ids) + 1; // id для новых товаров
                }
            },
            async saveParams() {
                await ParamsService.updateParams({
                    heading: this.params.heading,
                    mainLink: this.params.mainLink,
                    domain: this.params.domain,
                    hiddenText: this.params.hiddenText,
                    menuType: this.params.menuType,
                    mainBtn: this.params.mainBtn,
                    mainBtnText: this.params.mainBtnText,
                    ugly: this.params.ugly,
                    cardVariant: this.params.cardVariant,
                    bodyBg: this.params.bodyBg,
                    catalog: this.params.catalog,
                    greetings: this.params.greetings,
                    primary: this.params.primary,
                });
                this.saved = true;
                setTimeout(() => {
                    this.saved = false;
                }, 1000);

                this.$emit('changeParams');
            },
            addMenuItem () {
                this.params.catalog.push({
                    id: nextItemId++
                })
            },
            removeMenuItem(index) {
                let result = confirm('Вы уверены?');
                if (result) {
                    this.$delete(this.params.catalog, index);
                }
            },
            toggleBgInput: function () {
                this.bgInput = this.bgInput === 'text' ? 'color' : 'text';
            },
            togglePrimaryInput: function () {
                this.primaryInput = this.primaryInput === 'text' ? 'color' : 'text';
            },
            toggleOpen: function () {
                let open = !this.isOpen;
                this.isOpen = open;
                localStorage.setItem('isOpen', open);
            }
        },
        mounted() {
            this.getParams();
        }
    }
</script>

<style lang="scss" scoped>
    .bg-success {
        padding: 15px 30px;
        /*margin: 0;*/
        /*position: absolute;*/
        /*right: 15px;*/
        /*bottom: 15px;*/
        z-index: 1000;
        position: sticky;
        top: auto;
        bottom: 70px;
        display: table;
        margin-left: auto;
        margin-bottom: -55px;
        margin-top: -15px;
        pointer-events: none;
        font-size: 2em;
        .glyphicon {
            top: 0.15em;
        }
    }

    /* Анимации появления и исчезновения могут иметь */
    /* различные продолжительности и динамику.       */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }

    .panel-body {
        position: relative;
    }

    .panel-heading {
        margin-top: 0;
        margin-bottom: 0;
        &:last-child {
            border-bottom: none;
        }
    }

    .panel-footer {
        position: sticky;
        left: 0;
        bottom: 0;
        z-index: 999;
    }

    .table-responsive {
        margin-bottom: 20px;
        .table {
            margin-bottom: 0;
        }
    }
</style>