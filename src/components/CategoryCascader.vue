<template>
<el-cascader
  expand-trigger="hover"
  :options="options"
  change-on-select
  :props="{
    label: 'cat_name',
    value: 'cat_id',
    children: 'children'
  }"
  @change="handleChange"
  v-model="selectedOptions">
</el-cascader>
</template>

<!-- <CategoryCascader type="3"></CategoryCascader> -->
<script>

export default {
  // props: ['type'],
  // 建议以后定义 props 使用下面的方式更严谨
  // 参考文档：https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81
  props: {
    type: {
      type: [String, Number],
      default: 2
    }
  },
  async created () {
    // 获取商品分类数据绑定到级联选择器中
    const res = await this.$http({
      url: '/categories',
      params: {
        type: this.type
      }
    });
    this.options = res.data.data;
  },
  methods: {
    // 每当级联选择器选择的节点改变都会调用 handleChange 方法
    // 我们可以在该方法内部把当前组件的数据通过事件的方式传递给父组件
    handleChange () {
      // 这里的含义就是对外部发布一个自定义事件，外部就是使用该组件的父组件
      // 然后我们可以在调用该组件的时候，为其指定自定义事件处理函数来接收结果
      this.$emit('gaibianle', this.selectedOptions);
    }
  },
  data () {
    return {
      options: [],
      selectedOptions: []
    };
  }
};
</script>

<style>
</style>
