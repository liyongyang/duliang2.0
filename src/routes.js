import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import chartsInfo from './views/nav1/chartsInfo.vue'
import repair from './views/nav2/repair.vue'
import Page5 from './views/nav2/Page5.vue'
import warehouse from './views/nav3/warehouse.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  // { path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '车辆运营',
    iconCls: 'fa fa-car',//图标样式class
    children: [
      { path: '/main', component: Main, name: '主页' },
      { path: '/table', component: Table, name: '表单' },
      { path: '/form', component: Form, name: '日检' },
      { path: '/chartsInfo', component: chartsInfo, name: '图表' },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '车辆工程',
    hidden: true,
    iconCls: 'fa fa-gears',
    children: [
      { path: '/repair', component: repair, name: '车辆维修' },
      { path: '/page5', component: Page5, name: '页面5', hidden: true }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    hidden: true,
    iconCls: 'fa fa-shopping-cart',
    leaf: true,//只有一个节点
    children: [
      { path: '/warehouse', component: warehouse, name: '物料仓库' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: 'MORE +',
    hidden: true,
    iconCls: 'fa fa-spinner',
    children: [
      { path: '/echarts', component: echarts, name: 'echarts' }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
];

export default routes;