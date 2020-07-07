<template>
  <div class='checkLog'>
    <el-table border
              v-show="!this.editFormVisible"
              :data="tableData"
              style="width: 100%"
              height="840"
              :row-class-name="tableRowClassName">
      <el-table-column prop="created_at"
                       label="日期"
                       width="140">
      </el-table-column>
      <el-table-column prop="vehicle_id"
                       label="车辆"
                       width="120">
        <template slot-scope="scope">
          <el-tag type="success"
                  effect="dark">{{scope.row.vehicle_id}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator"
                       label="提交人"
                       width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operator != null"
                  effect="dark">{{scope.row.operator}}</el-tag>
          <el-tag v-else
                  type="danger"
                  effect="dark">出车日检未填写</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="异常检查信息"
                       width="640">
        <template slot-scope="props">
          <span v-if="props.row.info =='' ">车辆日常检查无异常</span>
          <el-table v-else
                    :data="props.row.info"
                    style="width: 100%"
                    :row-class-name="tableRowClassName">
            <el-table-column label="检查项">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.level == 1 "
                            class="item"
                            effect="light"
                            content="该问题已提交车辆工程"
                            placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
                <span>{{scope.row.name}}:</span>
                <span style="color: #F56C6C">{{scope.row.comment}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="140">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      content="填写"
                      placement="top">
            <el-button v-if="scope.row.operator == null "
                       @click="handleClick(scope.$index, scope.row)"
                       type="primary"
                       icon="el-icon-edit"
                       circle></el-button>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="修改"
                      placement="top">
            <el-button v-if="scope.row.operator != null "
                       @click="handleClick(scope.$index, scope.row)"
                       type="warning"
                       icon="el-icon-edit"
                       circle></el-button>
          </el-tooltip>
          <!-- <el-span v-if="scope.row.info != '' && scope.row.info != null ">已通知车辆工程及时处理</el-span> -->
        </template>
      </el-table-column>
      <el-table-column label="车辆状态"
                       width="140">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.info != '' && scope.row.info != null "
                      class="item"
                      effect="dark"
                      content="处理中..."
                      placement="top">
            <el-button type="danger"
                       @click="stateBtn(scope.$index, scope.row)"
                       icon="el-icon-close"
                       circle></el-button>
          </el-tooltip>
          <el-tooltip v-else
                      class="item"
                      effect="dark"
                      content="良好"
                      placement="top">
            <el-button type="success"
                       icon="el-icon-check"
                       circle></el-button>
          </el-tooltip>
          <!-- <el-span v-if="scope.row.info != '' && scope.row.info != null ">已通知车辆工程及时处理</el-span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  data () {
    return {
      tableData: [],
      editFormVisible: false,
      curr_id: '',
      curr_time: '',
    }
  },
  // 监听
  computed: {},
  // 监控
  watch: {
    curr_id (e) {
      return this.curr_id
    },
    curr_time (e) {
      return this.curr_time
    },
  },
  // 方法
  methods: {
    openFullScreen (time) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      setTimeout(() => loading.close(), time)
    },
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
          console.log(data.data)
          that.tableData = data.data.datas
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
    handleClick (index, row) {
      this.editFormVisible = true;
      this.curr_id = row.id
      this.curr_time = row.created_at
      // console.log(this.editFormVisible)
      // this.editForm = Object.assign({}, row);
      console.log(row)
      // console.log(this.editForm)
    },
    stateBtn (index, row) {
      // row.info = null
      this.$notify.error({
        title: 'MSG：',
        message: '待开发'
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getLIst()
    this.openFullScreen(500)
  }
}
</script>
<style scoped>
.checkLog {
  height: 800px;
}
.el-table .warning-row {
  background: rgb(57, 201, 117);
}
.el-table .success-row {
  background: rgb(64, 207, 233);
}
</style>
