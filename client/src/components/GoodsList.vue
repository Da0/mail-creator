<template lang="pug">
    form.form.form-horizontal
        .form-group
            label.col-sm-3.control-label( for="title" )
                abbr( title="Категория (диван, кровать и т.д.). Добавлять, если несколько списков" ) Заголовок
            .col-sm-9
                input.form-control( type="text", name="title", id="title", placeholder="Заголовок", v-model.trim="post.title" )
        .form-group
            label.col-sm-3.control-label( for="link" )
                abbr( title="Ссылка с заголовка и кнопки" ) Сылка
            .col-sm-9
                input.form-control( type="url", name="link", id="link", placeholder="Сылка", v-model.trim="post.link" )
        .form-group
            label.col-sm-3.control-label( for="btn" ) Текст кнопки
            .col-sm-9
                input.form-control( type="text", name="btn", id="btn", placeholder="Смотреть все модели", v-model.trim="post.btn" )
        .form-group
            label.col-sm-3.control-label( for="pic" ) Изображение категории
            .col-sm-9
                p.image-wrapper
                    img.img-responsive( v-if="image", :src="image" )
                    img.img-responsive( v-else-if="post.pic", :src="config.host + ':' + config.srcPort + '/img/' + post.pic" )
                    button.btn.btn-danger.btn-sm( v-if="image || post.pic" type="button", title="Удалить изображение категории", @click="categoryPicRemove" )
                        i.glyphicon.glyphicon-trash
                input( type="file", id="pic", ref="file", @change.prevent="categoryPicChange" )
                input( type="hidden", name="postPic", v-model.trim="post.pic" )
        .form-group
            label.col-sm-3.control-label Тип листинга
            .col-sm-9
                label.radio-inline
                    input( type="radio" name="listType" value="default", v-model="post.listType", @change="listTypeChange" )
                    | По умолчанию
                label.radio-inline
                    input( type="radio" name="listType" value="korpus", v-model="post.listType", @change="listTypeChange" )
                    | Корпусная мебель

        .form-group.row
            GoodsItem(
                v-for="(n, index) in post.list",
                :item="n", :index="index", :key="n.id",
                v-on:remove="removeFromList",
                v-on:addImg="addImgItem",
                v-on:changeTrim="changeTrimItem",
                :addTrim="getTrim()"
             )

        button.btn.btn-block.btn-info( type="button", @click="addGoods")
            i.glyphicon.glyphicon-plus
            | &nbsp;Добавить товар

        .btn-group.btn-group-justified.btn-group_fixed
            .btn-group
                router-link.btn.btn-warning.btn-lg( :to="{ name: 'Posts' }" )
                    i.glyphicon.glyphicon-chevron-left
                    span.hidden-xs &nbsp;Не сохранять
            .btn-group
                button.btn.btn-success.btn-lg( type="button", @click="savePost" )
                    i.glyphicon.glyphicon-ok
                    span.hidden-xs &nbsp;Сохранить список товаров
</template>

<script>
    import GoodsItem from '@/components/GoodsItem';
    import PostsService from '@/services/PostsService';
    import BannersService from '@/services/BannersService';

    let nextGoodsId = 1; // id товара. На 1 больше, чем его порядковый номер

    export default {
        data: function () {
            return {
                config: require('../../../server/src/config/config'),
                image: '',
                post: {
                    title: '',
                    link: '',
                    btn: '',
                    pic: '',
                    listType: '',
                    list: []
                }
            }
        },
        components: { GoodsItem },
        props: {
            edit: Boolean
        },
        methods: {
            async getPost() {
                const response = await PostsService.getPost({id: this.$route.params.id});
                let list = response.data.list;
                let ids = [];

                this.post.title = response.data.title;
                this.post.link = response.data.link;
                this.post.btn = response.data.btn;
                this.post.pic = response.data.pic;
                this.post.listType = response.data.listType;
                this.post.list = list;

                list.forEach(function(item) {
                    ids.push(item.id);
                });

                nextGoodsId = Math.max.apply(null, ids) + 1; // id для новых товаров
            },
            async editPost() {
                let list = this.post.list;

                if (list.length) {
                    await PostsService.updatePost({
                        id: this.$route.params.id,
                        title: this.post.title,
                        link: this.post.link,
                        btn: this.post.btn,
                        pic: this.post.pic,
                        listType: this.post.listType,
                        list: list,
                    });
                    this.$router.push({name: 'Posts'})
                }
            },
            async addPost() {
                let list = this.post.list;

                if (list.length) {
                    await PostsService.addNewPost({
                        title: this.post.title,
                        link: this.post.link,
                        btn: this.post.btn,
                        pic: this.post.pic,
                        listType: this.post.listType,
                        list: list
                    });
                    this.$router.push({name: 'Posts'})
                } else {
                    alert('Empty fields!')
                }
            },
            savePost() {
                if (this.edit) {
                    this.editPost();
                }
                else {
                    this.addPost();
                }
            },
            addGoods() {
                this.post.list.push({
                    id: nextGoodsId++
                })
            },
            removeFromList(index) {
                let result = confirm('Вы уверены?');
                if (result) {
                    let pic = this.post.list[index].pic;
                    if (pic) {
                        PostsService.imgDelete(pic)
                    }
                    this.$delete(this.post.list, index);
                }
            },
            addImgItem(imgName, ind) {
                if ( this.post.list[ind].pic && (this.post.list[ind].pic !== imgName) ) {
                    // Если картинку заменили, надо удалить старую
                    PostsService.imgDelete(this.post.list[ind].pic)
                }

                this.post.list[ind].pic = imgName;
            },
            changeTrimItem(trimvVal, ind) {
                this.post.list[ind].trimImgs = trimvVal;
            },
            listTypeChange() {
                const isTrim = this.getTrim();
                this.post.list.forEach(function(item) {
                    item.trimImgs = isTrim;
                });
            },
            getTrim() {
                return this.post.listType !== 'default'
            },
            async categoryPicChange() {
                this.image = this.$refs.file.files[0];

                const imgName = this.image.name;
                let oldPic = this.post.pic;
                let formData = new FormData();

                formData.append('file', this.image);

                BannersService.imgLoad(formData);

                if (oldPic && oldPic !== imgName) {
                    BannersService.imgDelete(oldPic);
                }

                this.post.pic = imgName;

                this.createImage();
            },
            categoryPicRemove() {
                let result = confirm('Вы уверены?');
                if (result) {
                    let pic = this.post.pic || this.image;
                    if (pic) {
                        BannersService.imgDelete(pic);
                        this.post.pic = null;
                        this.image = null;
                    }
                }
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
        },
        mounted() {
            if (this.edit) {
                this.getPost()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .image-wrapper {
        display: table;
        position: relative;
        max-width: 100%;
        .btn {
            position: absolute;
            top: 0;
            right: 0;
            margin-left: 5px;
            border-radius: 0;
            @media (min-width: 1024px) {
                top: -1px;
                left: 100%;
                right: auto;
            }
        }
    }
</style>