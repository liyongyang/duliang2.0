<template>
  <div class='check-form'>
    <transition name="el-zoom-in-top">
      <el-form v-show="this.vehicle_id"
               class="transition-box"
               ref="form"
               :model="form"
               :rules="rules"
               label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="填表人"
                          prop="operator">
              <el-col :span="12">
                <el-input v-model="form.operator"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出车日期"
                          required>
              <el-col :span="11">
                <el-form-item prop="day">
                  <el-date-picker type="date"
                                  placeholder="选择日期"
                                  v-model="form.day"
                                  format="yyyy.MM.dd"
                                  value-format="yyyy.MM.dd"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="top-item">
          <div class="opitem">
            <p content-position="left"><i class="el-icon-edit"></i> 静态检查项目</p>
            <el-row v-for="item in this.options.static"
                    :index="item.index"
                    :key="item.index">
              <el-col :span="12">
                <el-form-item>
                  <span slot="label"
                        v-text="item.name"></span>
                  <el-tooltip class="item"
                              effect="dark"
                              placement="top-start">
                    <span slot="content"
                          v-text="item.description"></span>
                    <el-select v-model="item.status">
                      <el-option label="OK"
                                 value="0"></el-option>
                      <el-option label="有问题"
                                 value="1"></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-input v-model="item.comment"
                          v-show="item.status == 1"
                          placeholder="填写详细信息"></el-input>
              </el-col>
            </el-row>
          </div>
          <div class="opitem">
            <p content-position="left"><i class="el-icon-edit"></i> 动态检查项目</p>
            <el-row v-for="item in this.options.dynamic"
                    :index="item.index"
                    :key="item.index">
              <el-col :span="12">
                <el-form-item>
                  <span slot="label"
                        v-text="item.name"></span>
                  <el-tooltip class="item"
                              effect="dark"
                              placement="top-start">
                    <span slot="content"
                          v-text="item.description"></span>
                    <el-select v-model="item.status">
                      <el-option label="OK"
                                 value="0"></el-option>
                      <el-option label="有问题"
                                 value="1"></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-input v-model="item.comment"
                          v-show="item.status == 1"
                          placeholder="填写详细信息"></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-col style="text-align: center">
          <el-button type="success"
                     round
                     @click="onSubmit1('form')"> 确 定 </el-button>
        </el-col>
      </el-form>
    </transition>
    <el-dialog :visible.sync="drawer"
               :with-header="false"
               :before-close="handleClose"
               style="text-align: center">
      <div class="drawerform">
        <el-col>
          <el-radio v-model="form.block"
                    border
                    label="0">未影响当天正常测试</el-radio>
          <el-radio v-model="form.block"
                    border
                    label="1"
                    :disabled='this.level'>有影响当天正常测试</el-radio>
        </el-col>
        <el-col>
          <el-radio-group v-model="block"
                          fill='409EFF'>
            <el-radio-button label="0">无需上报</el-radio-button>
            <el-radio-button :disabled='this.level'
                             label="1">上报车辆工程部门</el-radio-button>
          </el-radio-group>
        </el-col>
        <div v-show="this.block == 1">
          <el-alert title="勾选项将提交给车辆工程部尽快处理"
                    type="error"
                    effect="dark">
          </el-alert>
          <el-table :data="this.form.info"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column property="name"
                             label="检查项"
                             width="150"></el-table-column>
            <el-table-column property="comment"
                             label="故障说明"></el-table-column>
          </el-table>
        </div>
        <el-button @click="onSubmit(form)"
                   type="success"
                   round
                   style="margin: 10px auto;">SUBMIT</el-button>
      </div>
    </el-dialog>
    <el-card v-show="!this.vehicle_id"
             class="empty">
      <div>
        <img src="../../../static/icons/accident_counts.png"
             style="width: 40px;height:40px;margin:0 auto"
             alt=""
             srcset="">
        <p><strong>请先选择车辆再填写日常检查表喔~</strong></p>
      </div>
      <!-- <checkLog v-show="!this.vehicle_id"></checkLog> -->
    </el-card>

  </div>
</template>

<script>
import bus from '../util/msgbus'
import checkLog from './checkLog'
export default {
  props: {
    vehicle_id: String
  },
  components: { checkLog },
  // inject: ['reload'],
  data () {
    return {
      showLog: true,
      form: {
        vehicleId: '',
        day: '',
        operator: '',
        block: '0',
        info: []
      },
      drawer: false,
      block: 0,
      level: true,
      options: [],
      rules: {
        operator: [
          { required: true, message: '请输入填表人姓名', trigger: 'blur' }
        ],
        day: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  // 监听
  computed: {},
  // 监控
  watch: {
    vehicle_id () {
      this.showLog = !this.showLog
    },
    form () {
      return this.form
      // console.log(this.form)
    }
  },
  // 方法
  methods: {
    menuList () {
      let that = this
      this.axios
        .get(
          '/api/inspection-form/menu-list'
        )
        .then(function (data) {
          that.options = data.data.datas
          for (let i = 0; i < that.options.static.length; i++) {
            that.options.static[i].status = 'OK'
          }
          for (let i = 0; i < that.options.dynamic.length; i++) {
            that.options.dynamic[i].status = 'OK'
          }
          // console.log(that.options)
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
    },
    onSubmit1 (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < that.options.static.length; i++) {
            if (that.options.static[i].status == 1) {
              that.form.info.push(that.options.static[i])
              this.level = false
            }
          }
          for (let j = 0; j < that.options.dynamic.length; j++) {
            if (that.options.dynamic[j].status == 1) {
              that.form.info.push(that.options.dynamic[j])
              this.level = false
            }
          }
          this.drawer = true
        } else {
          that.$message.error('请检查信息是否填写完整')
          return false
        }
      })
    },
    handleClose (done) {
      this.$confirm('重新填写？')
        .then(_ => {
          done(this.form.info = [])
        })
        .catch(_ => { })
    },
    handleSelectionChange (val) {
      for (let i = 0; i < val.length; i++) {
        val[i].level = '1'
      }
    },
    onSubmit (formName) {
      // console.log(this.form)
      let that = this
      that.axios
        .post(
          '/api/inspection-form/day',
          {
            'vehicleId': that.vehicle_id,
            'day': that.form.day,
            'operator': that.form.operator,
            'block': that.form.block,
            'info': that.form.info
          },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data)
          Object.assign(that.$data, that.$options.data())
          that.menuList()
          location.reload()
          // that.reload()
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.menuList()
  }
}
</script>
<style scoped>
.top-item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.opitem {
  width: 600px;
}
.drawerform {
  padding: 30% 0;
}
.empty {
  width: 100%;
  height: 780px;
  text-align: center;
  margin: 0 auto;
  border: none;
  background-color: #ffffff;
  box-shadow: none;
  color: #60656d;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
