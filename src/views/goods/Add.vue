<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-row class="row-add">
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="stepActive" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-tabs
      tab-position="left"
      v-model="activeName"
      @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <CategoryCascader
              type="3"
              @gaibianle="handleGaiBianLe"></CategoryCascader>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        <el-button @click="handleNextStep">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        商品图片
        <el-row>
          <el-col :span="4">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品详情" name="2">
        <quill-editor
          v-model="form.goods_introduce"
          ref="myQuillEditor"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
        <el-row>
          <el-col :span="4">
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
  data() {
    return {
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: ''
      },
      activeName: '0',
      stepActive: 0
    };
  },
  methods: {
    async handleAdd() {
      const res = await this.$http({
        url: 'goods',
        method: 'post',
        data: this.form
      });
      const { data, meta } = res.data
      if (meta.status === 201) { // 添加成功
        this.$message({
          type: 'success',
          message: meta.msg
        })
      } else if (meta.status === 400) {
        this.$message({
          type: 'warning',
          message: meta.msg
        })
      }
    },
    handleGaiBianLe(data) {
      console.log(data);
      this.form.goods_cat = data.join(',');
    },
    onEditorBlur () {
      console.log('onEditorBlur')
    },
    onEditorFocus () {
      console.log('onEditorFocus')
    },
    onEditorReady () {
      console.log('onEditorReady')
    },
    handleNextStep () {
      this.activeName = Number.parseInt(this.activeName) + 1 + ''
      this.stepActive++
    },
    /**
     * 处理 tabs 标签点击事件
     */
    handleTabClick (tab, event) {
      // console.log('handleTabClick')
      // console.log(tab.index)
      this.stepActive = tab.index - 0
    }
  },
  components: {
    CategoryCascader,
    quillEditor
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
