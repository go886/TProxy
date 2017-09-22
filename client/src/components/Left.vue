<template>
    <div class="root">
        <el-button type="text" icon="share">NETWORK</el-button>
        <el-button type="text"  icon="caret-right" @click="onMonitor">监控列表</el-button>
        <el-button type="text" icon="caret-right" @click="onRule">规则引擎</el-button>
        <el-button type="text" icon="caret-right" @click="onMock">mock</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    methods: {
        onMonitor() {
            this.$router.push('/')
        },
        onRule() {
            this.$router.push('/rule')
        },
        onMock() {
            this.$router.push('/mock')
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
    width: 500px;
    min-width: 120px;
    max-width: 120px;
    padding-top: 10px;
    /* background-color: grey; */
}
.el-button--text {
    color: #333333;
    font-size: 12px;
}
</style>
