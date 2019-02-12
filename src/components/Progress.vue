<template>
  <div class="myprogress">
    <div class="label">
      {{value}}
      <span v-if="percent">%</span>
    </div>
    <div class="pie-wrap" ref="pie"></div>
    <h3>{{title}}</h3>
  </div>
</template>
  
<script>
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入饼图
import "echarts/lib/chart/pie";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

export default {
  name: "myprogress",
  props: {
    title: { type: String, required: true },
    value: { type: Number, required: true },
    percent: { type: Boolean, required: true, default: false }
  },
  data() {
    return {};
  },
  mounted() {
      this.initCircle();
  },
  watch:{
      value:function () {  
          this.initCircle()
      }
  },
  methods: {
    initCircle() {
      let data = [];
      if (this.percent) {
        data.push({ value: this.value, name: "" });
        data.push({ value: 100 - this.value, name: "" });
      } else {
        data.push({ value: 0, name: "" });
        data.push({ value: 100, name: "" });
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.pie);
      // 绘制图表
      myChart.setOption({
        color: ["rgb(102,208,113)", "rgb(223,223,223)"],
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["90%", "100%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data
          }
        ]
      });
    }
  }
};
</script>
  
<style lang="scss" scoped>
@mixin hwwrap {
  width: px2rem(175);
  height: px2rem(175);
}
.myprogress {
  position: relative;
  text-align: center;
  color: #000;

  .label {
    line-height: px2rem(175);
    position: absolute;
    @include hwwrap;
    left: 0;
    top: 0;
    font-size: px2rem(48);
    span {
      vertical-align: super;
      font-size: $text-size-small;
    }
  }
  h3 {
    font-size: $text-size;
    padding: px2rem(27) 0 px2rem(52);
    line-height: $text-size;
  }
  .pie-wrap {
    width: px2rem(175);
    height: px2rem(175);
  }
  .pie-wrap {
    @include hwwrap;
  }
}
</style>