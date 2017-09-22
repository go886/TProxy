<template>
    <div class="root">
        <div class="bottomtips">
            <span >{{status}}</span>
        </div>
        <!-- <div class="glyphicon glyphicon-chevron-up up" @click="onShowLog"></div>
            <div class='wanring' id='tips' :style="{visibility:tips ? 'visible': 'hidden'}">{{tips}}</div>
            <textarea class='log' ref='log' :style="{visibility:openlog ? 'visible': 'hidden'}" disabled="disabled">{{log}}</textarea> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        status() {
            if (this.$store.state.isrunning) {
                return '服务运行中...'
            } else {
                return '服务未启动'
            }
        }
    }
}
</script>

<style scoped>
.root {
    -webkit-user-select: none;
    display: flex;
    flex-direction: row;
    /*justify-content: center;*/
    align-items: center;
    max-height: 36px;
    height: 36px;
    /* background-color: rgb(250, 250, 250); */
    font-size: 10px;
    color:#808080;
    /*color:darkblue;*/
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    /* background: linear-gradient(to bottom, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%); */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(229, 229, 229, 1) 100%);
    /* background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(229,229,229,1) 100%);    border-top: 1px solid rgb(236, 236, 236); */
    /*background-repeat: repeat-x;*/
    /*background-image: -webkit-linear-gradient(top, white 0, #f8efc0 100%);
    background-image: -o-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
    background-image: -webkit-gradient(linear, left top, left bottom, from(#fcf8e3), to(#f8efc0));        background-image: linear-gradient(to bottom, #fcf8e3 0, #f8efc0 100%);*/
}
</style>

