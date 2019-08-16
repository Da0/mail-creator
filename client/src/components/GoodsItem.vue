<template lang="pug">
    .col-md-6.goods-item
        .panel.panel-default( v-bind:class="{ 'panel-success': item.isActive, 'panel-danger': item.hasError }" )
            .panel-heading Товар №{{ index + 1 }}
            .panel-body
                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'link-'+index" ) url
                    .col-sm-10.col-md-9
                        input.form-control( type="url", name="link", placeholder="https://www.example.com/product", v-model.trim="item.link", v-bind:id="'link-'+index" )
                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'title-'+index" ) Название
                    .col-sm-10.col-md-9
                        input.form-control( type="text", name="title", placeholder="Товар №1", v-model.trim="item.title", v-bind:id="'title-'+index" )
                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'cat-'+index" ) Категория
                    .col-sm-10.col-md-9
                        input.form-control( type="text", name="cat", placeholder="Катеогория товара", v-model.trim="item.cat", v-bind:id="'cat-'+index" )
                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'catLink-'+index" ) Ссылка на Категорию
                    .col-sm-10.col-md-9
                        input.form-control( type="url", name="catLink", placeholder="https://www.example.com/cat/", v-model.trim="item.catLink", v-bind:id="'catLink-'+index" )

                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'descr-'+index" ) Цвет, размер
                    .col-sm-10.col-md-9
                        input.form-control( type="text", name="descr", placeholder="Красный, 100х500", v-model.trim="item.descr", v-bind:id="'descr-'+index" )
                .form-group
                    label.col-sm-2.col-md-3.control-label( v-bind:for="'pic-'+index", style="padding-top:3px;" ) Изображение
                    .col-sm-10.col-md-9
                        p(v-if="image")
                            img.img-responsive( :src="image" )
                        p(v-else-if="item.pic")
                            img.img-responsive( :src="config.host + ':' + config.srcPort + '/img/' + item.pic" )
                        p
                            input( type="file", ref="file", @change.prevent="onFileChange", v-bind:id="'pic-'+index" )
                            input( type="hidden", name="pic", v-model.trim="item.pic" )
                        p
                            label
                                input.trim( type="checkbox", name="trimImgs", v-bind:checked="item.trimImgs !== undefined ? item.trimImgs : addTrim", @change.prevent="onTrimChange" )
                                abbr( title="Установить ДО загрузки изобржения" ) Обрезать пустое пространство

                .form-group.form-group_prices
                    .col-xs-12.col-sm-4
                        label( v-bind:for="'price-'+index" ) Цена
                        input.form-control( type="text", name="price", placeholder="22 990р.", v-model.trim="item.price", v-bind:id="'price-'+index", autocomplete="off" )
                    .col-xs-12.col-sm-4
                        label( v-bind:for="'oldPrice-'+index" ) Старая цена
                        input.form-control( type="text", name="oldPrice", placeholder="37 000р.", v-model.trim="item.oldPrice", v-bind:id="'oldPrice-'+index", autocomplete="off" )
                    .col-xs-12.col-sm-4
                        label( v-bind:for="'discount-'+index" ) Скидка
                        input.form-control( type="text", name="discount", placeholder="-38%", v-model.trim="item.discount", v-bind:id="'discount-'+index", autocomplete="off" )

            .panel-footer.text-right
                button.btn.btn-danger( type="button", @click="removeItem" )
                    i.glyphicon.glyphicon-trash
                    | &nbsp;Удалить товар

</template>

<script>
    import PostsService from '@/services/PostsService'

    export default {
        data: function () {
            return {
                image: '',
                config: require('../../../server/src/config/config')
            }
        },
        props: {
            item: {
                type: Object,
                required: true
            },
            index: Number,
            addTrim: Boolean
        },
        methods: {
            removeItem: function () {
                this.$emit('remove', this.index);
            },
            async onFileChange() {
                const trimImgs = this.item.trimImgs !== undefined ? this.item.trimImgs.toString() : this.addTrim.toString();

                this.image = this.$refs.file.files[0];

                let formData = new FormData();
                let imgName = this.image.name;

                if (this.image.type === 'image/webp' || this.image.type === 'image/png') {
                    imgName = imgName.split('.', 1)[0] + '.jpg'
                }

                formData.append('file', this.image);

                await PostsService.imgLoad(formData, trimImgs);

                this.$emit('addImg', imgName, this.index);

                this.createImage();
            },
            onTrimChange(e) {
                this.$emit('changeTrim', e.target.checked, this.index);
            },
            createImage() {
                let image = new Image();
                let reader = new FileReader();
                let vm = this;

                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(this.image);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goods-item {
        label {
            font-size: smaller;
        }
        input.trim {
            margin: 5px 5px 0 0;
            vertical-align: -2px;
        }
        .panel-body {
            .row, .form-group {
                margin-left: -5px;
                margin-right: -5px;
            }
            [class^="col-"] {
                padding-left: 5px;
                padding-right: 5px;
            }
        }
    }
    @media (min-width: 768px) {
        .form-group_prices {
            text-align: left;
        }
    }
    @media (min-width: 992px) {
        .goods-item:nth-child(odd) {
            clear: left;
        }
    }
</style>