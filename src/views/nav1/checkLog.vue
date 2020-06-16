<template>
  <div class='checkLog'>
    <el-table border
              :data="tableData"
              style="width: 100%"
              height="1200"
              :row-class-name="tableRowClassName">
      <el-table-column prop="created_at"
                       label="日期"
                       width="200">
      </el-table-column>
      <el-table-column prop="vehicle_id"
                       label="车辆"
                       width="200">
        <template slot-scope="scope">
          <el-tag type="success"
                  effect="dark">{{scope.row.vehicle_id}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator"
                       label="提交人"
                       width="200">
        <template slot-scope="scope">
          <el-tag effect="dark">{{scope.row.operator}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="异常信息">
        <template slot-scope="props">
          <span v-if="props.row.info =='' ">车辆日常检查无异常</span>
          <el-table v-else
                    :data="props.row.info"
                    style="width: 100%"
                    :row-class-name="tableRowClassName">
            <el-table-column label="检查项">
              <template slot-scope="scope">
                <span>{{scope.row.name}}:</span>
                <span style="color: #F56C6C">{{scope.row.comment}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="300">
        <template slot-scope="scope">
          <el-button v-if="scope.row.info =='' "
                     plain
                     disabled
                     @click="handleClick(scope.row)"
                     type="danger"
                     size="small"
                     round>车辆检查正常</el-button>
          <el-button v-else
                     @click="handleClick(scope.row)"
                     type="danger"
                     size="small"
                     round>处理中 <i class="el-icon-loading"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  components: {},
  data () {
    return {
      tableData: []
    }
  },
  // 监听
  computed: {},
  // 监控
  watch: {},
  // 方法
  methods: {
    getLIst () {
      let that = this
      this.axios
        .get(
          '/api/inspection-form/list',
          {},
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data.data)
          that.tableData = data.data.datas
          // console.log(that.tableData)
          // for (let i = 0; i < data.datas.length; i++) {
          // for (let j = 0; j < data.datas[i].info.length; j++) {
          // that.info.push(data.datas[i].info)
          // }
          // }
          // console.log(that.info)
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'warning-row'
      } else if (rowIndex === 1) {
        return 'success-row'
      }
      return ''
    },
    handleClick (row) {
      // console.log(row)
      this.$message({
        message: '开发中...',
        type: 'error'
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getLIst()
  }
}
</script>
<style scoped>
.checkLog {
  height: 900px;
}
.el-table .warning-row {
  background: rgb(57, 201, 117);
}
.el-table .success-row {
  background: rgb(64, 207, 233);
}
</style>
