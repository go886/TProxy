<template>
    <div class='root' @dblclick="ondblclick">
        <div class='left'>
            <el-button v-if="!isRunning" type="text" icon="caret-right" @click="onStart">启动</el-button>
            <el-button v-else type="text" icon="loading" @click="onStop">停止</el-button>
            <el-button type="text" icon="setting" @click="onSetting">设置</el-button>
            <el-button type="text" icon="document" @click="onLogger">日志</el-button>
        </div>
        <div class='right'>
            <el-button type="text" icon="information" @click="onCA">证书</el-button>
        </div>
        <Setting ref="setting" />
    </div>
</template>

<script>
import Setting from '@/components/Setting';
export default {
    name: 'hello',
    components: {
        Setting,
    },
    data() {
        return {
            isMaxed: false,
        }
    },
    computed: {
        isRunning() {
            return this.$store.state.isrunning;
        }
    },
    methods: {
        ondblclick() {
            const browserWindow = this.$.remote.getCurrentWindow()
            this.isMaxed = !this.isMaxed;
            this.isMaxed ? browserWindow.maximize() : browserWindow.unmaximize();
        },
        onStart() {
            this.$store.start();
        },
        onStop() {
            this.$store.stop();
        },
        onSetting() {
            if (this.isRunning) {
                this.$message({
                    message: '请先停止服务',
                    type: 'warning'
                });
                return;
            }
            this.$refs.setting.show();
        },
        onLogger() {

        },
        onCA() {

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
    height: 60px;
    max-height: 60px;
    min-height: 60px;
    /*background-color: cadetblue;*/
    background: linear-gradient(to bottom, rgba(238, 238, 238, 1) 0%, rgba(204, 204, 204, 1) 100%);

    /* background: linear-gradient(darkgrey, white); */
    border-bottom: 1px solid rgb(236, 236, 236);
    /* background-color: rgb(245, 245, 245); */
    /* background-color: #F9FAFC; */
    flex-direction: row;
    display: flex;
    align-content: center;
    /*padding-top: 50px;*/
    align-items: flex-end;
    padding-bottom: 10px;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    /*拖动区域禁止选择*/
    padding-left: 20px;
    padding-right: 30px;
    /* box-shadow: 1px 1px 5px #888888; */
}

.left {
    display: flex;
    flex-direction: row;
    align-content: center;
    flex: 1;
}

.right {
    justify-content: flex-end;
    /*-items: flex-end;*/
}

.el-button--text {
    color: #333333;
    font-size: 12px;
}

.el-icon-share::after {
    color: rgb(127, 127, 127);
    font-size: 24px;
}








/* .line {
    position: fixed;
    left: 0px;
    bottom: 5px;
    height: 5px;
    width: 100%;
background: linear-gradient(white, darkgrey);
} */
</style>
