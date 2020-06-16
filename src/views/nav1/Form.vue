<template>
  <div class="check-page">
    <el-button type="success"
               v-show="this.showLog"
               round
               class="reback"
               @click="reback()">
      提交日检表 >></el-button>
    <el-button type="success"
               v-show="!this.showLog"
               round
               class="reback"
               @click="reback()">
      << 查看日志
         </el-button>
         <div
         class="header">
        <div class="nav-search"
             v-show="!this.showLog">
          <i class="el-icon-location-information"></i>
          <el-select v-model="vehicle_id"
                     placeholder="请选择车辆">
            <el-option v-for="item in options"
                       :key="item.index"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
  </div>
  <checkForm :vehicle_id='this.vehicle_id'
             v-show="!this.showLog"></checkForm>
  <checkLog v-show="this.showLog"></checkLog>
  </div>
</template>

<script>
import bus from '../util/msgbus'
import checkForm from './checkForm'
import checkLog from './checkLog'
export default {
  components: {
    checkForm,
    checkLog
  },
  data () {
    return {
      arr: [],
      options: [],
      vehicle_id: '',
      showLog: true
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
  },
  // 方法
  methods: {
    reback () {
      this.showLog = !this.showLog
      // if (this.showLog) {
      //   this.$router.go(0)
      // }
    },
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
          bus.$emit('vehicle_park', data.data.datas)
          // for (let i = 0; i < data.datas.length; i++) {
          //   for (let j = 0; j < data.datas[i].children.length; j++) {
          //     that.arr.push(data.datas[i].children[j].value)
          //   }
          // }
          // let vehicleArr = Array.from(new Set(that.arr))
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
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
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
.reback {
  width: 140px;
  /* height: 50px; */
  margin-left: 80%;
}
.header {
  display: flex;
  flex-direction: row;
  padding-bottom: 18px;
  text-align: center;
}
.bread-crumb {
  text-align: center;
  line-height: 40px;
  margin: 0 20px;
}
</style>
