<template>
  <div class="vehicle-page">
    <div class="vehicle-info">
      <div class="header">
        <div class="nav-search">
          <i class="el-icon-location-information"></i>
          <el-select v-model="vehicle_id"
                     placeholder="请选择车辆"
                     @change="getData()">
            <el-option v-for="item in options"
                       :key="item.index"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-breadcrumb separator="/"
                       class="bread-crumb">
          <el-breadcrumb-item :to="{ path: '/' }"> Home </el-breadcrumb-item>
          <el-breadcrumb-item v-model="vehicle_item"
                              v-text="vehicle_item"></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="周报"
                     name="week">
        </el-tab-pane>
        <el-tab-pane label="月报"
                     name="month">
        </el-tab-pane>
        <!-- <el-tab-pane label="quarter"
                   name="quarter">
      </el-tab-pane> -->
        <el-tab-pane label="年报"
                     name="year">
        </el-tab-pane>
      </el-tabs>
      <el-form v-show="activeName == 'year'"
               ref="form"
               class="time-form"
               :model="form"
               label-width="80px">
        <el-form-item label="year:">
          <el-select v-model="form.year"
                     placeholder="请选择年"
                     style="width: 120px"
                     @change="select">
            <el-option v-for="item in timeData.years"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.year !== '' "
                      label="month:">
          <el-select v-model="form.month"
                     clearable
                     placeholder="请选择月"
                     style="width: 120px"
                     @change="select">
            <el-option v-for="item in timeData.months"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <chartData :single=single
               :arrayData=arrayData
               :vehicle_id=vehicle_id></chartData>
  </div>
</template>

<script>
import chartData from './echarts/chartData'
export default {
  components: {
    chartData
  },
  data () {
    return {
      vehicle_id: 'arts16_1',
      options: [],
      activeName: 'week',
      single: '',
      arrayData: [],
      allData: [],
      timeData: [],
      form: {
        year: '',
        month: ''
      }
    }
  },
  // 监听
  computed: {
    vehicle_item: function () {
      return this.vehicle_id
    }
  },
  // 监控
  watch: {
    options () {
      return this.options
    },
    vehicle_id (value) {
      Object.assign(this.$data.form, this.$options.data().form)
      this.getTime(value)
    },
    activeName (value) {
      // console.log(this.activeName)
      this.getData(value)
    },
    timeData (value) {
      return this.timeData
    },
    form (value) {
      return this.form
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
          // console.log(data)
          that.options = data.data.datas
          that.vehicle_id = that.options[0].value
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
    },
    // 获取数据时间
    getTime () {
      let that = this
      // console.log(that.vehicle_id)
      this.axios
        .post(
          '/api/vehicle/list-year-month',
          {
            'vehicle_id': that.vehicle_id
          },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data)
          that.timeData = data.data.datas
        })
        .catch(function (err) {
          that.$message({
            message: err,
            type: 'error'
          })
        })
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
    getData () {
      let that = this
      // that.openFullScreen(500)
      that.axios
        .post(
          '/api/vehicle/single-interval',
          {
            'vehicle_id': that.vehicle_id, 'interval': that.activeName
          },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          // console.log(data)
          if (data.data.datas) {
            that.single = data.data.datas.single
            that.arrayData = data.data.datas.array
            // console.log(that.single)
          } else {
            that.$message({
              message: '当前筛选没有数据',
              type: 'error'
            })
          }
        })
        .catch(function () {
          that.$message({
            message: '当前筛选没有数据',
            type: 'error'
          })
        })
    },
    select () {
      // console.log(this.form)
      let that = this
      that.axios
        .post(
          '/api/vehicle/single-interval',
          {
            'vehicle_id': that.vehicle_id, 'year': that.form.year, 'month': that.form.month
          },
          {
            useLoading: true
          }
        )
        .then(function (data) {
          console.log(data.data)
          that.single = data.data.datas.single
          that.arrayData = data.data.datas.array
        })
        .catch(function () {
          that.$message({
            message: '当前筛选没有数据',
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
    this.getLIst()
    this.getData()
    this.getTime()
  }
}
</script>
<style scoped>
/* @import "../assets/style.css"; */
.active {
  margin-right: 24px;
}
.header {
  display: flex;
  flex-direction: row;
  /* padding-bottom: 18px; */
  text-align: center;
  margin-right: 40px;
}
.bread-crumb {
  text-align: center;
  line-height: 40px;
  margin: 0 20px;
}
.time-form {
  height: 50px;
  display: inline-flex;
  padding: 0 10px;
  margin-left: 120px;
}
.vehicle-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
</style>
