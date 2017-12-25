<template>
    <el-dialog title="设置" :modal="false" :visible.sync="settingVisible" @close="onClose">
        <el-form ref="form" :model="setting" label-width="80px">
            <el-form-item label="Port">
                <el-input v-model="setting.port"></el-input>
            </el-form-item>
            <el-form-item class="show-record-list" label="抓包列表">
                <el-switch v-model="setting.enabledRecord" on-color="#13ce66" on-text="" off-text="">
                </el-switch>
            </el-form-item>

            <el-form-item label="Global">
                <el-switch on-text="" off-text="" v-model="setting.global"></el-switch>
            </el-form-item>
            <el-form-item label="Https">
                <el-switch on-text="" off-text="" v-model="setting.forceProxyHttps"></el-switch>
            </el-form-item>
            <!-- <el-form-item label="Speed(kb/s)">
                                        <el-select v-model="setting.throttle" allow-create placeholder="No throttling">
                                            <el-option v-for="item in throttleOptions" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item> -->
            <el-form-item class="menu-setting__btn">
                <el-button @click="onSubmit">保存</el-button>
                <el-button type="success" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            settingVisible: false,
        }
    },
    computed:{
        setting() {
            return this.$store.getters.setting;
        }
    },
    methods: {
        show() {
            this.settingVisible = true;
        },
        handleClose() {
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$store.saveSetting();
                    this.settingVisible = false;
                }
            })
        },
        onReset() {
            this.$refs.form.resetFields();
        },
        onClose() {
            this.settingVisible = false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
    /* background-color: red; */
    width: 100%;
    height: 100%;
}
</style>
