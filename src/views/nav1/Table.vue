<template>
  <div class="tabel-info">
    <div class="formData">
      <div class="search">
        <el-select class="change-vehicle"
                   v-model="vehicle_id"
                   placeholder="请选择筛选车辆"
                   size="small"
                   @change="getData">
          <el-option v-for="item in vehicle"
                     :key="item.index"
                     :label="item.value"
                     :value="item.value">
          </el-option>
        </el-select>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       small
                       :page-sizes="[50,100]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="formData.length">
        </el-pagination>
      </div>
      <!-- type item -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="E_Stop"
                     name="e_stop">
        </el-tab-pane>
        <el-tab-pane label="take_over"
                     name="takeover">
        </el-tab-pane>
        <el-tab-pane label="TandE"
                     name="eandt">
        </el-tab-pane>
      </el-tabs>

      <el-table ref="filterTable"
                v-loading="loading"
                height="725"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="formData
              .slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :filter-change="filterTagTable"
                border
                stripe
                style="width: 100%;text-align: center;">
        <div class="block">
          <el-pagination layout="prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
        <el-table-column label="start_time"
                         width="200">
          <template slot-scope="scope">
            <p v-show="scope.row.es_start"><span style="color:blue;font-weight: bold">ES: </span>{{ scope.row.es_start }}</p>
            <p v-show="scope.row.takeover_start"><span style="color:red;font-weight: bold">TO: </span>{{ scope.row.takeover_start }}</p>
          </template>
        </el-table-column>
        <el-table-column label="duration"
                         width="120">
          <template slot-scope="scope">
            <p v-show="scope.row.es_start"><span style="color:blue;font-weight: bold">ES: </span>{{ Math.round(scope.row.es_time) }}秒</p>
            <p v-show="scope.row.takeover_start"><span style="color:red;font-weight: bold">TO: </span>{{ Math.round(scope.row.takeover_time) }}秒</p>
          </template>
        </el-table-column>
        <el-table-column label="type"
                         prop="type"
                         width="120">
          <template slot-scope="scope">
            <el-tag type="warning"
                    effect="dark">{{activeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="vehicle_id"
                         prop="vehicle_id"
                         width="120">
          <template slot-scope="scope">
            <el-tag type="success"
                    effect="dark">{{scope.row.vehicle_id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="park"
                         width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover"
                        placement="top">
              <p>start_time: {{ scope.row.start_time }}</p>
              <p>end_time: {{ scope.row.end_time }}</p>
              <div slot="reference"
                   class="name-wrapper">
                <el-tag size="medium"
                        effect="dark">{{ scope.row.park_id }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="tag"
                         label="tag"
                         width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cause_type != ''"
                    type="info"
                    effect="dark"
                    @close="handleClose(scope.$index, scope.row)"
                    :disable-transitions="true">{{scope.row.cause_type}}</el-tag>
            <p v-else>未填写...</p>
          </template>
        </el-table-column>
        <el-table-column label="comment"
                         width="360">
          <template slot-scope="scope">
            <p v-if="scope.row.cause_desc != ''">{{scope.row.cause_desc}}</p>
            <p v-else>未填写...</p>
          </template>
        </el-table-column>
        <el-table-column label="Options"
                         width="260">
          <template slot-scope="scope">
            <el-button size="mini"
                       :plain="true"
                       type="success"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">ignore</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--编辑界面-->
    <el-dialog title="编辑"
               :visible.sync="editFormVisible"
               :close-on-click-modal="false">
      <el-form ref="editForm"
               :model="editForm"
               label-width="120px">
        <el-form-item label="vehicle_id:"
                      prop="name">
          <el-tag auto-complete="off">{{this.editForm.vehicle_id}}</el-tag>
        </el-form-item>
        <el-form-item label="es_start:"
                      v-show="editForm.es_start"
                      prop="name">
          <el-tag type="danger"
                  auto-complete="off">{{this.editForm.es_start}}</el-tag>
        </el-form-item>
        <el-form-item label="takeover_start:"
                      v-show="editForm.takeover_start"
                      prop="name">
          <el-tag type="danger"
                  auto-complete="off">{{this.editForm.takeover_start}}</el-tag>
        </el-form-item>
        <el-form-item label="cause_type:"
                      prop="name">
          <div id="typeChoose">
            <el-cascader :options="cause_type"
                         :props="{ expandTrigger: 'hover' }"
                         v-model="curr_type"
                         @change="causeType">
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="comment"
                      prop="name">
          <el-input v-model="editForm.cause_desc"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click.native="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: '',
      activeName: 'e_stop',
      formData: [],
      formtData: [],
      vehicle_id: '',
      tableData: [], // 数据
      currentPage: 1, // 默认显示第一页
      pageSize: 50, // 默认每页显示10条
      totalNum: '1000', // 总页数
      arr: [],
      vehicle: [],
      cause_type: [],
      tagc: true,
      index_cause_type: [],
      editFormVisible: false,//编辑界面是否显示
      //编辑界面数据
      curr_type: '',
      editForm: {
        id: 0,
        es_start: '',
        takeover_start: '',
        vehicle_id: '',
        cause_type: '',
        cause_desc: ''
      }
    }
  },
  // 监听
  computed: {
  },
  // 监控
  watch: {
    cause_desc (e) {
      return this.tableData.cause_desc
    },
    editForm (e) {
      return this.editForm
    },
    activeName (value) {
      this.getData(value)
    },
    formData () {
      return this.formData
    }
  },

  // 方法
  methods: {
    getLIst () {
      let that = this
      this.axios
        .get(
          '/api/vehicle/draw-list-vehicle',
          {},
          {
            useLoading: true
          }
        )
        .then(function (data) {
          that.vehicle = data.data.datas
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
    },
    getData (type) {
      let that = this
      that.axios
        .post(
          '/api/vehicle/etform-obtain',
          { 'type': that.activeName, 'vehicle_id': that.vehicle_id, 'pageNum': 1, 'pageSize': 1000 },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data.data.datas)
          that.formData = data.data.datas.real.result
          that.cause_type = data.data.datas.cause_type
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
      this.handleCurrentChange(1)
    },
    openFullScreen (time) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      setTimeout(() => loading.close(), time)
    },
    handleSizeChange (psize) {
      this.openFullScreen(800)
      this.pageSize = psize
    },
    handleCurrentChange (cpage) {
      this.openFullScreen(800)
      this.currentPage = cpage
    },
    handleClose (index, row) {
      row.cause_type = null
    },
    causeType (value, label) {
      this.editForm.cause_type = value[1]
    },
    filterTagTable (filters) {
      if (filters.aStatus) {
      }
      this.getAll() // 筛选所选项下的所有数据，需要调用后端接口
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      // console.log(row)
    },
    handleSubmit () {
      let that = this
      // console.log(that.editForm)
      that.axios
        .post(
          '/api/vehicle/handle',
          { 'id': that.editForm.id, 'cause_type': that.editForm.cause_type, 'cause_desc': that.editForm.cause_desc },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data)
          that.editFormVisible = false;
          that.curr_type = ''
          that.getData()
          that.$message({
            message: '提交成功',
            type: 'success'
          })
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
    },
    handleDelete (index, row) {
      // console.log(index, row)
      let h = this.$createElement
      this.$message({
        message: h('p', null, [
          h('span', null, '该模块功能'),
          h('i', { style: 'color: teal' }, '待讨论')
        ]),
        type: 'error'
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // this.totalNum = this.formData.length
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    let type = 'e_stop'
    this.getData(type)
    this.getLIst()
  }
}
</script>
<style>
.content-container {
  margin: 40 auto;
}
.search {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.el-table__row {
  height: 50px;
}
.el-table td,
.el-table th {
  padding: 2px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: center;
}
</style>
