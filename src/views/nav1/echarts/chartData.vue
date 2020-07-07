<template>
  <div class="dailyMsg container-fluid">
    <div style="height:140px;width:1630px">
      <el-card class="box-card"
               style="height:90px;float:left;margin:0 10px;padding:10px"
               v-for="(item,index) in single"
               :key="item.index">
        <div class="topic">
          <img :src="'/static/icons/'+index+'.png'"
               alt=""
               srcset="" />
          <div>
            <p>{{index}}:</p>
            <h2>{{item}}</h2>
          </div>
        </div>
      </el-card>
    </div>
    <div v-if="single"
         id="myChart1"
         style="width: 1600px;height: 600px;"></div>
    <el-card v-else
             class="empty">
      <img src="/static/icons/accident_counts.png"
           style="width: 35px;height:35px;margin:0 auto"
           alt=""
           srcset="">
      <p><strong>无测试数据...</strong></p>
    </el-card>
  </div>
</template>

<script>
// import bus from '../util/msgbus'
import echarts from 'echarts'
export default {
  props: {
    'single': {},
    'arrayData': Array,
    'vehicle_id': String
  },
  components: {},
  data () {
    return {
      isEmpty: true,
      dayData: [],
      run_time: [],
      run_mileage: [],
      jira: [],
      bag_size: [],
      takeover: [],
      E_stop: [],
      //
      fault_counts: [],
      accident_counts: []
    }
  },
  // 监听
  computed: {},
  // 监控
  watch: {
    single () {
      // console.log(this.single)
      if (this.single) {
        this.$nextTick(() => {
          Object.assign(this.$data, this.$options.data())
          for (let i = 0; i < this.arrayData.length; i++) {
            this.dayData.push(this.arrayData[i].day)
            this.run_time.push(this.arrayData[i].run_time)
            this.run_mileage.push(this.arrayData[i].run_mileage)
            this.jira.push(this.arrayData[i].jira)
            this.takeover.push(this.arrayData[i].takeover)
            this.E_stop.push(this.arrayData[i].E_stop)
            this.bag_size.push(this.arrayData[i].bag_size)
            this.fault_counts.push(this.arrayData[i].fault_counts)
            this.accident_counts.push(this.arrayData[i].accident_counts)
          }
          this.drawPie1('myChart1')
        })
      } else {
      }
    }
  },
  // 方法
  methods: {
    drawPie1 (id) {
      this.mychart1 = echarts.init(document.getElementById('myChart1'))
      this.mychart1.setOption({
        title: '',
        grid: {
          left: 70,
          top: 50,
          right: 60,
          bottom: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {// 坐标轴指示器，坐标轴触发有效
            type: 'line'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        /* 图例说明 */
        legend: {
          // 图例排项 vertical-"竖向"; horizontal-"横向"
          selected: { 'jira': false, 'bag_size': false },
          orient: 'horizontal',
          // 图例组件离容器左侧的距离
          left: 500,
          top: 0,
          // 图例文字的样式
          textStyle: {
            color: '#000000'
          },
          // 与series中每个name对应
          data: ['运营时间', '运营里程', '接管次数', '急停次数', 'jira', 'bag_size']
        },
        xAxis: {
          data: this.dayData
        },
        yAxis: {},
        /// 用于添加框选缩放功能
        toolbox: {
          show: true,
          feature:
          {
            dataZoom:
            {
              realtime: false,
              yAxisIndex: 'none'
            },
            restore: {}
          }
        },
        dataZoom:
          [
            { type: 'inside' }, { type: 'slider' }
          ],
        series: [
          {

            name: '运营时间',
            type: 'line',
            fontSize: 28,
            borderWidth: 1,
            color: '#3300CC',
            data: this.run_time,
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '运营里程',
            type: 'line',
            borderWidth: 1,
            color: '#009966',
            data: this.run_mileage,
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '接管次数',
            type: 'line',
            fontSize: 28,
            borderWidth: 1,
            color: '#FF6666',
            data: this.takeover,
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '急停次数',
            type: 'line',
            borderWidth: 1,
            color: '#FF00FF',
            data: this.E_stop,
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: 'jira',
            type: 'line',
            fontSize: 28,
            borderWidth: 1,
            color: '#CC6600',
            data: this.jira
          },
          {
            name: 'bag_size',
            type: 'line',
            borderWidth: 1,
            color: '#6600CC',
            data: this.bag_size
          }
        ]
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () { },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    // console.log(this.allData)
  }
}
</script>
<style scoped>
.topic {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.topic > img {
  width: 35px;
  height: 35px;
  margin-right: 20px;
  padding: 15px 0;
}
.box-card {
  border-radius: 8px;
}
.empty {
  width: 440px;
  height: 180px;
  line-height: 60px;
  text-align: center;
  margin: 0 auto;
  border: none;
  background-color: #f6f7f6;
  box-shadow: none;
  color: #60656d;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
