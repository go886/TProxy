<template>
<div>
    <transition name="slide-fade" v-if="visible">
        <div class="root">
            <el-form ref="form" class="ruleForm" :model="formData" label-width="100px">
                <el-form-item label="导入样例">
                    <el-select v-model="ruleName" placeholder="" @change="ruleSelectChange">
                        <el-option v-for="item in ruleOptions" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="名称(自定义)">
                    <el-input v-model="currentRule.name"></el-input>
                </el-form-item>
                <el-form-item label="规则代码">
                    <codemirror class="test" v-model="currentRuleValue" :options="editorOption"></codemirror>
                </el-form-item>

                <el-form-item>
                    <el-button @click="onSubmit">保存</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </transition>
</div>
</template>

<script>
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
import { codemirror } from 'vue-codemirror';

export default {
    components: {
        codemirror
    },
    data() {
        return {
            recordlist: false,
            visible: false,
            editorOption: {
                mode: 'text/javascript',
                lineNumbers: true,
                line: true,
                tabSize: 2,
                theme: 'neo',
            },
            ruleOptions: [{
                name: '修改请求数据',
                id: 'sample_modify_request_data',
                system: true,
            }, {
                name: '修改请求头',
                id: 'sample_modify_request_header',
                system: true,
            }, {
                name: '修改返回数据',
                id: 'sample_modify_response_header',
                system: true,
            }],
            formData: {},
            ruleName: null,
            currentRule: {},
            currentRuleValue: '',
        }
    },
    computed: {
    },
    methods: {
        show(rule) {
            this.visible = true;
            this.setCurrentRule(rule);
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.currentRule.system) {
                        delete this.currentRule.system;
                        this.currentRule.id = generateUUIDv4();
                        this.currentRule.createTime = (new Date()).getTime();
                        this.$store.saveRuleContent(this.currentRule.id, this.currentRuleValue)
                        this.$store.addRule(this.currentRule);
                    } else {
                        this.$store.saveRuleContent(this.currentRule.id, this.currentRuleValue)
                    }
                    this.onClose();
                }
            })
        },
        onClose() {
            this.visible = false;
        },
        setCurrentRule(rule) {
            if (rule) {
                this.$.api.getRuleValue(rule.id)
                    .then(res => {
                        this.currentRuleValue = res;
                        this.currentRule = rule;
                    }).catch(res => {
                        this.$message.error(res)
                    });
            } else {
                this.currentRule = {};
                this.currentRuleValue = '';
            }
        },
        ruleSelectChange(ruleId) {
            if (this.currentRule || ruleId !== this.currentRule.id) {
                this.ruleOptions.forEach((item) => {
                    if (item.id == ruleId) {
                        var rule = JSON.parse(JSON.stringify(item));
                        this.setCurrentRule(rule);
                    }
                });
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.CodeMirror {
    height: 600px;
    /* height: 100%; */
    width: 100%;
}
</style>

<style scoped>
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

.root {
    position: absolute;
    top: 70px;
    right: 0;
    /* bottom: 106px; */
    background-color: #fff;
    width: 75%;
    /* height:100% - 36px; */
    overflow-y: scroll;
    box-shadow: -3px 2px 9px rgba(0, 0, 0, 0.4);
    z-index: 999;
    padding: 10px;
}

.ruleForm {
    line-height: 1px;
    height: 100%;
    /* background-color:red; */
}

.abc {
    width: 100%;
}

.el-form-item__content {
    line-height: 20px;
}

.test {
    line-height: 20px;
}
</style>
