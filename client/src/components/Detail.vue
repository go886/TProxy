<template>
    <transition name="slide-fade">
        <div class="root">
            <el-tabs v-model="activeName" @tab-click="onTabClick">
                <el-tab-pane label="Headers" name="headers"></el-tab-pane>
                <el-tab-pane label="Preview" name="preview"></el-tab-pane>
                <el-tab-pane label="Response" name="response"></el-tab-pane>
                <el-tab-pane label="Cookies" name="cookies"></el-tab-pane>
                <!-- {{headers}} -->
                <!-- <network-detail :detail-content="detailContent" :headers="currentRow" :panel-type="activeName">
                                                                                        </network-detail> -->
                <el-collapse v-model="activeNames" v-show="activeName === 'headers'" key="1">
                    <el-collapse-item title="General" name="general">
                        <div>
                            <b>Request URL: </b>{{headers.url}}</div>
                        <div>
                            <b>Request Method: </b>{{headers.method}}</div>
                        <div>
                            <b>Status Code: </b>{{headers.statusCode}}</div>
                        <div>
                            <b>Protocol: </b>{{headers.protocol}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="Response Header" name="resheaders">
                        <div v-for="(value, key) in headers.resHeader">
                            <b>{{key}}: </b>{{value}}
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Request Headers" name="reqheaders">
                        <div v-for="(value, key) in headers.reqHeader" v-if="key !== 'Cookie'">
                            <b>{{key}}: </b>{{value}}
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-show="activeName === 'preview'" key="2">
                    <div v-html="preview"></div>
                    <!-- <tree-view :data="jsonPreview" max-depth="5" v-show="jsonPreview"></tree-view> -->
                </el-collapse>
                <el-collapse v-show="activeName === 'response'" key="3">
                    {{content.content}}
                </el-collapse>
                <el-collapse v-show="activeName === 'cookies'" key="4">
                    <el-table :data="cookies" border style="width: 100%">
                        <el-table-column prop="name" label="Name" width="200">
                        </el-table-column>
                        <el-table-column prop="value" label="Value">
                        </el-table-column>
                    </el-table>
                </el-collapse>
            </el-tabs>
        </div>
    </transition>
</template>

<script>
//highlight code 缓存，避免二次渲染
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const highlightCache = {}

export default {
    props: {
        id: 0,
    },
    data() {
        return {
            activeNames: ['general', 'resheaders', 'reqheaders'],
            activeName: "headers",
            headers: {
                type: Object,
                default: function() {
                    return {
                        url: 'sssss',
                        method: '',
                        statusCode: '',
                        protocal: '',
                        reqHeader: {},
                        resHeader: {}
                    }
                }
            },
            content: Object,
        }
    },
    computed: {
        cookies() {
            if (this.headers) {
                let cookies = (this.headers.reqHeader || {}).cookie || (this.headers.reqHeader || {}).Cookie;
                if (cookies) {
                    return cookies.split(';').map((item) => {
                        return {
                            name: item.split('=')[0],
                            value: item.split('=')[1]
                        };
                    });
                }
            }
            return [];
        },
        preview() {
            let detail = this.content;
            if (this.activeName === 'preview') {
                let type = detail.type || '';

                if (type.match('json')) {
                    return '';
                } else if (type.match(/css|javascript|html/) || 1) {
                    return highlightCache[detail.id] ||
                        (highlightCache[detail.id] =
                            '<pre><code>' + hljs.highlightAuto(detail.content||"").value + '</code></pre>'
                        );
                } else if (type.match('image')) {
                    return '<img src="' + this.headers.url + '">';
                } else {
                    return detail.content;
                }

            }
        }
    },
    created() {
        this.loadData();
        this.$watch('id', () => {
            this.loadData();
        });
    },
    methods: {
        loadData() {
            this.$.api.getRecorder(this.$props.id).then(res => {
                this.headers = res || {}
            }).catch(res => {

            });

            this.$.api.fetchBody(this.$props.id).then(res => {
                this.content = res || {};
            }).catch(res => {

            });
        },
        onTabClick() {

        },

    }
}
</script>

<style scoped>
.root {
    position: absolute;
    top: 70px;
    right: 0;
    bottom: 106px;
    background-color: #fff;
    width: 45%;
    /* height:100% - 36px; */
    overflow-y: scroll;
    box-shadow: -3px 2px 9px rgba(0, 0, 0, 0.4);
    z-index: 999;
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .3s ease;
}

.slide-fade-enter,
.slide-fade-leave-active {
    transform: translate3d(200px, 0, 0);
    opacity: 0;
}
</style>

