<template lang="pug">
    form.form.form-horizontal
        .form-group
            label.col-sm-2.control-label Тип баннера
            .col-sm-10.text-left
                .radio
                    label
                        input( type="radio", name="bannerType", value="default", v-model="banner.type" )
                        | По умолчанию
                .radio
                    label
                        input( type="radio", name="bannerType", value="rassrochka", v-model="banner.type" )
                        | Рассрочка
                .radio
                    label
                        input( type="radio", name="bannerType", value="count", v-model="banner.type" )
                        | Счётчик
        .form-group( v-if="banner.type !== 'count'" )
            label.col-sm-2.control-label( for="pic" ) Изображение
            .col-sm-10
                p(v-if="image")
                    img.img-responsive( :src="image" )
                p(v-else-if="banner.pic")
                    img.img-responsive( :src="config.host + ':' + config.srcPort + '/img/' + banner.pic" )
                input( type="file", id="pic", ref="file", @change="onFileChange" )
                input.form-control( type="hidden", name="pic", id="picVal", v-model.trim="banner.pic" )
        .form-group
            label.col-sm-2.control-label( for="title" ) Заголовок
            .col-sm-10
                input.form-control( type="text", name="title", id="title", placeholder="Заголовок", v-model.trim="banner.title" )
        .form-group
            label.col-sm-2.control-label( for="link" ) Сылка
            .col-sm-10
                input.form-control( type="url", name="link", id="link", placeholder="Сылка", v-model.trim="banner.link" )
        .form-group( v-if="banner.type !== 'count'" )
            label.col-sm-2.control-label( for="text" ) Текст
            .col-sm-10
                textarea.form-control( name="text", id="text", placeholder="Какой-то текст", v-model.trim="banner.text", rows="5" )
        .form-group( v-if="banner.type === 'default'" )
            label.col-sm-2.control-label( for="mute" ) Мелкий текст
            .col-sm-10
                textarea.form-control( name="mute", id="mute", placeholder="Мелкий текст", v-model.trim="banner.mute", rows="3" )
        .form-group( v-if="banner.type === 'default' || banner.type === 'count'" )
            label.col-sm-2.control-label( for="textAlign" ) Выравнивание
            .col-sm-10
                select.form-control( name="textAlign", id="textAlign", v-model.trim="banner.textAlign" )
                    option( value="", disabled, selected ) Выравнивание
                    option( value="left" ) По левому краю
                    option( value="center" ) По центру
                    option( value="right" ) По правому краю

        .form-group( v-if="banner.type === 'count'" )
            label.col-sm-2.control-label( for="countUrl") Счётчик URL
            .col-sm-10
                input.form-control( type="url", name="countUrl", id="countUrl", placeholder="http://gen.sendtric.com/countdown/kc8kjbdk8h", v-model.trim="banner.countUrl" )

        .form-group( v-if="banner.type === 'count'" )
            div.col-sm-6
                .form-group
                    label.col-sm-4.control-label( for="bg") Фон
                    div.col-sm-8
                        .input-group
                            input.form-control( v-bind:type="bgType", name="bg", id="bg", placeholder="#D05454", v-model.trim="banner.bg" )
                            span.input-group-addon.color-toggle( v-on:click.stop="colorTypeToggle('bgType')" )
                                i.glyphicon.glyphicon-pencil

            div.col-sm-6
                .form-group
                    label.col-sm-4.control-label( for="color" ) Текст
                    div.col-sm-8
                        .input-group
                            input.form-control( v-bind:type="colorType", name="color", id="color", placeholder="#333333", v-model.trim="banner.color" )
                            span.input-group-addon.color-toggle( v-on:click.stop="colorTypeToggle('colorType')" )
                                i.glyphicon.glyphicon-pencil


        .form-group( v-if="banner.type === 'default'" )
            label.col-sm-2.control-label Промокоды
            .col-sm-10.text-left
                .row.form
                    .col-sm-6( v-for="(n, index) in banner.promocodes" )
                        .well
                            button.btn.btn-danger.btn-sm.btn-del( type="button", @click="removePromo(index)", title="Удалить промокод" )
                                i.glyphicon.glyphicon-trash
                            .form-group
                                label(v-bind:for="'item-title-'+index") Заголовок
                                input.form-control( type="text", placeholder="Промокод на 500 руб.", v-model.trim="n.title", v-bind:id="'item-title-'+index" )
                            .form-group
                                label(v-bind:for="'item-conditions-'+index") Условия
                                input.form-control( type="text", placeholder="при сумме заказа от 10 000руб.", v-model.trim="n.conditions", v-bind:id="'item-conditions-'+index" )
                            .form-group
                                label(v-bind:for="'item-code-'+index") Код
                                input.form-control( type="text", placeholder="TY500", v-model.trim="n.code", v-bind:id="'item-code-'+index" )
                            .form-group
                                label(v-bind:for="'item-link-'+index") Ссылка
                                input.form-control( type="url", placeholder="https://www.example.com/", v-model.trim="n.link", v-bind:id="'item-link-'+index" )


                button.btn.btn-info( type="button", @click="addPromo" )
                    i.glyphicon.glyphicon-plus
                    | &nbsp;Добавить промокод

        .btn-group.btn-group-justified.btn-group_fixed
            .btn-group
                router-link.btn.btn-warning.btn-lg( :to="{ name: 'Posts' }" )
                    i.glyphicon.glyphicon-chevron-left
                    span.hidden-xs &nbsp;Не сохранять
            .btn-group
                button.btn.btn-success.btn-lg( type="button", name="saveBanner", id="saveBanner", @click="saveBanner" )
                    i.glyphicon.glyphicon-ok
                    span.hidden-xs &nbsp;Сохранить баннер
</template>

<script>
    import BannersService from '@/services/BannersService';

    let nextPromoId = 1;

    export default {
        data() {
            return {
                bgType: 'text',
                colorType: 'text',
                image: '',
                banner: {
                    type: this.edit ? null : 'default',
                    promocodes: []
                },
                config: require('../../../server/src/config/config')
            }
        },
        props: {
            edit: Boolean
        },
        methods: {
            async getBanner() {
                const response = await BannersService.getBanner({id: this.$route.params.id});
                let ids = [];

                this.banner = response.data;

                this.banner.promocodes.forEach(function(item) {
                    ids.push(item.id);
                });

                if (ids.length) {
                    nextPromoId = Math.max.apply(null, ids) + 1; // id для новых товаров
                }
            },
            async addBanner() {
                await BannersService.addNewBanner({
                    title: this.banner.title,
                    link: this.banner.link,
                    pic: this.banner.pic,
                    text: this.banner.text,
                    textAlign: this.banner.textAlign,
                    mute: this.banner.mute,
                    bg: this.banner.bg,
                    color: this.banner.color,
                    type: this.banner.type,
                    countUrl: this.banner.countUrl,
                    promocodes: this.banner.promocodes
                });
                this.$router.push({name: 'Posts'})
            },
            async editBanner() {
                await BannersService.updateBanner({
                    id: this.$route.params.id,
                    title: this.banner.title,
                    link: this.banner.link,
                    pic: this.banner.pic,
                    text: this.banner.text,
                    textAlign: this.banner.textAlign,
                    mute: this.banner.mute,
                    bg: this.banner.bg,
                    color: this.banner.color,
                    type: this.banner.type,
                    countUrl: this.banner.countUrl,
                    promocodes: this.banner.promocodes
                });
                this.$router.push({name: 'Posts'})
            },
            saveBanner() {
                if (this.edit) {
                    this.editBanner();
                }
                else {
                    this.addBanner();
                }
            },
            onFileChange: function (e) {
                e.preventDefault();

                this.image = this.$refs.file.files[0];

                let formData = new FormData();

                formData.append('file', this.image);

                BannersService.imgLoad(formData);

                this.createImage();

                if ( this.banner.pic && this.banner.pic !== this.image.name ) {
                    // Если картинку заменили, надо удалить старую
                    BannersService.imgDelete(this.banner.pic)
                }

                this.banner.pic = this.image.name;
            },
            createImage() {
                let image = new Image();
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(this.image);
            },
            colorTypeToggle: function (param) {
                this[param] = this[param] === 'text' ? 'color' : 'text';
            },
            addPromo() {
                this.banner.promocodes.push({
                    id: nextPromoId++
                });
            },
            removePromo: function(index) {
                console.log(index);

                let result = confirm('Вы уверены?');

                if (result) {
                    this.$delete(this.banner.promocodes, index);
                }
            },
            // addImgItem(imgName, ind) {
            //     this.post.list[ind].pic = imgName;
            // }
        },
        mounted() {
            if (this.edit) {
                this.getBanner()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-horizontal .well {
        position: relative;
        .form-group {
            margin-left: 0;
            margin-right: 0;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .btn-del {
            position: absolute;
            top: -1px;
            right: -1px;
            border-radius: 0;
        }
    }
</style>