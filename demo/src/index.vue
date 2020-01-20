<!--  -->
<template>
  <div class="rel dib" :style="contanterStyle">
    <div class="svg-wrap" :style="wrapStyle">
      <svg id="svg" width="100%" height="100%">
        <path
          v-for="(item,index) in pathArr"
          :key="index"
          :d="item"
          :stroke="lineColor"
          fill="none"
          :style="'stroke-width: '+lineWdith+'px;'"
        ></path>
      </svg>
    </div>
    <div ref="connectList" class="connect-list rel">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvgConnectLine',
  components: {},
  props: {
    listenData: { // 监听数据用于刷新线条
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    lineWdith: { // 连接线宽度
      type: Number,
      default: 1
    },
    lineColor: { // 连接线颜色
      type: String,
      default: '#666'
    },
    lineWrapWdith: { // 连接线容器宽度
      type: Number,
      default: 50
    },
    direction: { // 连接线在左边还是右边left right
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      pointArr: []
    }
  },
  computed: {
    contanterStyle() { // 设置连接线容器布局
      const style = {}
      if (this.direction === 'left') {
        style['padding-left'] = this.lineWrapWdith + 'px'
      } else if (this.direction === 'right') {
        style['padding-right'] = this.lineWrapWdith + 'px'
      }
      return style
    },
    wrapStyle() { // 设置连接线容器位置
      const style = {}
      if (this.direction === 'left') {
        style['left'] = 0
      } else if (this.direction === 'right') {
        style['right'] = 0
      }
      style['width'] = this.lineWrapWdith + 'px'
      return style
    },
    pathArr() { // svg线条数组
      const paths = []
      let splitd = 0
      let begeain = ''
      try {
        begeain = 0.4 * this.lineWrapWdith
        splitd = parseInt(this.pointArr.length / 2)
      } catch (error) {
        console.log(error)
      }
      if (!this.pointArr.length) {
        return paths
      }
      const pointArr = this.pointArr
      const centerPoint = this.$refs.connectList.offsetHeight / 2
      let splitWidth = (this.lineWrapWdith - begeain) / splitd
      if (this.direction !== 'left') {
        begeain = this.lineWrapWdith - begeain
        splitWidth = begeain / splitd
      }
      pointArr.forEach((element, index) => {
        let str = ''
        let y1 = 100
        if (element < centerPoint) {
          y1 = begeain + splitWidth * index
          if (this.direction !== 'left') {
            y1 = begeain - splitWidth * index
          }
        } else if (element > centerPoint) {
          y1 = begeain + splitWidth * (this.pointArr.length - index - 1)
          if (this.direction !== 'left') {
            y1 = begeain - splitWidth * (this.pointArr.length - index - 1)
          }
        }
        if (this.direction === 'left') {
          str = `M0,${centerPoint} C${this.lineWrapWdith},${centerPoint} ${y1},${element} ${this.lineWrapWdith},${element}`
        } else {
          str = `M${this.lineWrapWdith},${centerPoint} C0,${centerPoint} ${y1},${element} 0,${element}`
        }
        paths.push(str)
      })
      return paths
    }
  },
  watch: {
    listenData() {
      this.$nextTick(() => {
        this.computedSvgData()
      })
    }
  },
  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      // this.computedSvgData()
    })
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.computedSvgData()
    })
  },
  beforeDestroy() {
  },
  created() {},
  methods: {
    computedSvgData() { // 计算线条
      const pointArr = []
      const connectItem = this.$refs.connectList.getElementsByClassName('connect-item')
      for (const key in connectItem) {
        if (connectItem.hasOwnProperty(key)) {
          const element = connectItem[key]
          pointArr.push(element.offsetTop + (element.offsetHeight / 2))
        }
      }
      this.pointArr = pointArr
    }
  }
}

</script>
<style lang='scss' scoped>
.svg-wrap{
  position: absolute;
  top: 0;
  bottom: 0;
}
</style>
