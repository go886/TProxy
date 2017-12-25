<template>
    <div class="root">
        <el-table :data="networkData" highlight-current-row stripe style="width: 100%; font-size:11px; overflow-x: auto; overflow-y:auto;" :row-class-name="tableRowClassName" @row-click="onRowClick">
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
        <Detail v-if="detailVisible" :id="currentId" />
    </div>
</template>

<script scoped>
import moment from 'moment';
import Detail from '@/components/Detail'

export default {
    components: {
        Detail
    },
    data() {
        return {
            detailVisible: false,
            currentId: null,
        }
    },
    computed: {
        networkData() {
            return this.$store.getters.networkData;
        }
    },
    methods: {
        tableRowClassName(row, index) {
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
            return moment(row.startTime).format('hh:mm:ss');
        },
        onRowClick(val) {
            if (this.currentId == val.id) {
                this.detailVisible = !this.detailVisible
            } else {
                this.detailVisible = true;
                this.currentId = val.id;
            }
        }
    }
}
</script>

<style>

  .el-table .error-row {
    color: #FF4949;
  }


  .el-table .gray-row {
    color: #999;
  }

  /* .el-table tr.current-row>td {
  background-color: #58B7FF;
} */

  .el-table .success-row td:nth-child(3) {
    color: #13CE66;
  }

  .el-table .error-row {
    color: #FF4949;
  }

  .el-table .odd-row {
    background: #FAFAFA;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root {
    width: 100%;
    height: 100%;
    flex: 1;
    overflow-x: auto;
    overflow-y: auto;

    /* height: 400px; */
}
</style>
