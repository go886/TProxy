<template>
    <div class="root">
        <el-table :data="networkData"  highlight-current-row stripe style="width: 100%; font-size:11px; overflow-x: auto; overflow-y:auto;" :row-class-name="tableRowClassName">
            <el-table-column type="index" width="60" />
            <el-table-column prop="method" label="Method" width="80">
            </el-table-column>
            <el-table-column prop="statusCode" label="code" width="80">
            </el-table-column>
            <el-table-column prop="host" label="Host" width="150">
            </el-table-column>
            <el-table-column prop="path" label="Path">
            </el-table-column>
            <el-table-column prop="mime" label="Mime" width="120">
            </el-table-column>
            <el-table-column prop="startTime" label="Start" width="80" :formatter="dateFormatter">
            </el-table-column>
        </el-table>
    </div>
</template>

<script scoped>
import moment from 'moment';

export default {
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    computed: {
        networkData() {
            return this.$store.getters.networkData;
        }
    },
    methods: {
        tableRowClassName(row, index) {
            return 'erow'
            if (row.method == 'CONNECT') {
                return 'gray-row';
            } else if (row.statusCode >= 400) {
                return 'error-row';
            } else if (row.statusCode == 200) {
                return 'success-row';
            }
            return '';
        },
        dateFormatter(row, column) {
            return moment(row.start).format('hh:mm:ss');
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
    width: 100%;
    height: 100%;
    flex: 1;
  
    /* height: 400px; */

}

.erow {
    color: #FF4949;
    background-color: red;
}





/* .el-table .gray-row {
    color: #999;
}
.el-table tr.current-row>td {
    background-color: #58B7FF;
}
.el-table .success-row td:nth-child(3) {
    color: #13CE66;
}

.el-table .odd-row {
    background: #FAFAFA;
} */
</style>
