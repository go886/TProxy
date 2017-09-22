<template>
    <div class="root">
        <div class="tool">
            <el-button icon="plus" @click="onRule">添加规则</el-button>
            <RuleForm ref="ruleform" />
        </div>
        <el-table :data="tableData" highlight-current-row stripe style="width: 100%;font-size:11px; overflow-x: hidden;">
            <el-table-column prop="name" label="名称" width="180">
                <template scope="scope">
                    <el-icon name="check" style="color:red" v-if="isCurrentRule(scope.row)"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="创建时间" :formatter="dateFormatter">
            </el-table-column>
            <el-table-column prop="op" label="操作">
                <template scope="scope">
                    <el-button size="small" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="onDelete(scope.row)">删除</el-button>
                    <el-button size="small" type="warning" v-if="isCurrentRule(scope.row)" @click="onCancel(scope.row)">取消</el-button>
                    <el-button size="small" type="info" v-else @click="onApply(scope.row)">应用</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import RuleForm from "@/components/RuleForm"
import moment from 'moment';

export default {
    components: {
        RuleForm
    },
    data() {
        return {
        }
    },
    computed: {
        tableData() {
            return this.$store.getters.rules;
        },

    },
    created() {
        this.$.api.getRules()
            .then(res => {
                this.$store.setRules(res);
            }).catch(res => {
                this.$message.error(res)
            })
    },
    methods: {
        isCurrentRule(rule) {
            return this.$store.state.activeRule && rule.id === this.$store.state.activeRule.id;
        },
        onRule() {
            this.$refs.ruleform.show();
        },
        dateFormatter(row, column) {
            return moment(row.createTime).format('YYYY/MM/DD  hh:mm');
        },
        onEdit(rule) {
            this.$refs.ruleform.show(rule)
        },
        onDelete(rule) {
            this.$store.removeRule(rule.id)
        },
        onCancel(rule) {
            this.$store.applyRule(null);
        },
        onApply(rule) {
            this.$store.applyRule(rule);
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

.tool {
    padding: 20px;
}
</style>
