<template>
  <section>
    <h2 class="section-title">autowise.ai——环卫自动驾驶方案提供者</h2>
    <div class="block">
      <el-image class="banner-img"
                :src="src">
        <div slot="placeholder"
             class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      src: '../../static/images/banner.jpg'
    }
  }
}

</script>

<style scoped>
.section-title {
  text-align: center;
  font-size: 32px;
  /* font-family: PingFangSC-Thin; */
  font-weight: 100;
  color: #333333;
  line-height: 45px;
  letter-spacing: 2px;
}
.banner-img {
  border-radius: 14px;
  box-shadow: #6c7cd3 1px 3px 20px;
  /* -webkit-transition: 0.3s; */
  /* transition: 0.3s; */
}
</style>