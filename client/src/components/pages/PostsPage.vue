<template lang="pug">
    .page-main( v-bind:class="{ 'page-main_preview' : iframe.active }" )
        .container
            .row
                .col-xs-12

                    // ---
                    h1.page-header
                        | Редактор писем

                    Params(v-on:changeParams="reloadIframe")

                    section.panel.panel-success( v-if="banners.length" )
                        h4.panel-heading Баннеры

                        .panel-body.panel-body_table
                            table.table.table-striped
                                thead
                                    tr
                                        th Title
                                        th Link
                                        th(width="1%") Action
                                tbody
                                    tr( v-for="(banner, index) in banners", :key="index" )
                                        td {{ banner.title }}
                                        td
                                            span.ellipsis(style="max-width:500px;") {{ banner.link }}
                                        td
                                            router-link( :to="{ name: 'EditBanner', params: { id: banner._id } }" ) Изменить
                                            button.btn.btn-danger.btn-sm( type="button", @click="removeBanner(banner._id)", title="Удалить" )
                                                i.glyphicon.glyphicon-trash

                        .panel-footer
                            router-link.btn.btn-info( :to="{ name: 'NewBanner' }" )
                                i.glyphicon.glyphicon-plus
                                | &nbsp;Добавить баннер

                    // ---
                    section.panel.panel-danger.text-center( v-else )
                        p Нет баннеров ...
                        div
                            router-link( :to="{ name: 'NewBanner' }" ) Добавить баннер

                    // ---
                    section.panel.panel-success( v-if="posts.length" )
                        h4.panel-heading Списки товаров
                        .panel-body.panel-body_table
                            table.table.table-striped
                                thead
                                    tr
                                        th Title
                                        th Link
                                        th(width="1%") List&nbsp;length
                                        th(width="1%") Action
                                tbody
                                    tr( v-for="(post, index) in posts", :key="index" )
                                        td {{ post.title }}
                                        td
                                            span.ellipsis(style="max-width:500px;") {{ post.link }}
                                        td {{ post.list ? post.list.length : 'null' }}
                                        td
                                            router-link( :to="{ name: 'EditPost', params: { id: post._id } }" ) Изменить
                                            button.btn.btn-danger.btn-sm( type="button", @click="removePost(post._id)", title="Удалить" )
                                                i.glyphicon.glyphicon-trash
                        .panel-footer
                            router-link.btn.btn-info( :to="{ name: 'NewPost' }" )
                                i.glyphicon.glyphicon-plus
                                | &nbsp;Добавить группу товаров

                    // ---
                    section.panel.panel-danger.text-center( v-else )
                        p Нет товаров ...
                        div
                            router-link( :to="{ name: 'NewPost' }" ) Добавить группу товаров

                    section.page-footer
                        a.btn.btn-warning.btn-lg.btn-block( href="/download", @click.prevent="download" )
                            i.glyphicon.glyphicon-download-alt
                            | &nbsp;Скачать
                        button.btn.btn-info.btn-block.iframe-toggle( type="button", @click="iframe.active === true ? iframe.active = false : iframe.active = true", title="Предпросмотр" )
                            i.glyphicon( v-bind:class="[iframe.active ? 'glyphicon-remove' : 'glyphicon-eye-open']" )
                            span.hidden-md.hidden-lg &nbsp;Предпросмотр

        iframe( v-if="iframe.active", id="preview", :src="config.host + ':' + config.srcPort", width=610, height=1800 )

</template>

<script>
    import PostsService from '@/services/PostsService';
    import BannersService from '@/services/BannersService';
    import DownloadService from '@/services/DownloadService';
    import Params from '@/components/Params';

    export default {
        name: 'PostsPage',
        data() {
            return {
                banners: [],
                posts: [],
                config: require('../../../../server/src/config/config'),
                iframe: {
                    active: false
                }
            }
        },
        components: { Params },
        methods: {
            async getBanners() {
                const response = await BannersService.fetchBanners();
                this.banners = response.data.banners
            },
            async removeBanner(value) {
                let result = confirm('Вы уверены?');
                if (result) {
                    await BannersService.deleteBanner(value);
                    this.getBanners()
                }
            },
            async getPosts() {
                const response = await PostsService.fetchPosts();
                this.posts = response.data.posts
            },
            async removePost(value) {
                let result = confirm('Вы уверены?');
                if (result) {
                    await PostsService.deletePost(value);
                    this.getPosts()
                }
            },
            async download() {
                const resp = await DownloadService.start();
                location.href = resp.data;
            },
            reloadIframe() {
                if (this.iframe.active) {
                    let $iframe = document.getElementById('preview');
                    $iframe.src += '';
                }
            }
        },
        mounted() {
            this.getBanners();
            this.getPosts();
        }
    }
</script>

<style lang="scss" scoped>
    $viewW: 627px;
    //
    th {
        text-align: center;
    }

    td .btn {
        margin-left: 0.5em;
        margin-right: 0.5em;
    }

    .form-group:last-child {
        margin-bottom: 0;
    }

    .panel-heading {
        margin-top: 0;
        margin-bottom: 0;
    }

    .panel-body {
        position: relative;
        &_table {
            padding: 0;
            margin: 0;
            overflow-x: auto;
            overflow-y: hidden;
            .table {
                margin: 0;
            }
        }
    }

    .page-footer {
        margin-top: 30px;
        .btn {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    iframe {
        border: none;
        margin-top: 2em;
        width: $viewW;
        max-width: 100%;
        max-height: 100vh;
        resize: horizontal;
        z-index: 988;
    }

    .iframe-toggle {
        &, &:focus {
            outline: none;
        }
    }

    .ellipsis {
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
    }

    @media (min-width: $viewW) {
        iframe {
            max-width: $viewW;
        }
    }
    @media (min-width: 992px) {
        .container {
            max-width: 100%;
        }
        .page-main_preview {
            padding-left: $viewW;
            .iframe-toggle {
                left: $viewW + 10;
            }
        }
        .iframe-toggle {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            padding: 0;
            font-size: 18px;
            i {
                top: 0.2em;
            }
            &:hover {
                box-shadow: 0 0 20px fade-out(black, 0.7);
            }
        }
        iframe {
            margin: 0;
            padding: 0;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            max-height: none;
            box-shadow: 0 0 40px fade-out(black, 0.4);
        }
    }
</style>
