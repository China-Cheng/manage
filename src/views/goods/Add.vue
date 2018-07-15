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
        <!-- action:用来指定图片上传的地址，只要告诉他图片上传的接口即可
        但是他和axios没关系，baseURL没用,所以要写完整的
        on-preview：预览图片的时候触发
        on-remov：删除的时候触发
        file-list：储存上传的图片数据
        由于上传组件不是使用的axios发送的请求，所以配置的请求拦截器无效，就没有token
        要自己配置，使用自带的Headers -->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :headers="header"
          :file-list="fileList2"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
      stepActive: 0,
      // 图片上传
      headers:{Authorization: window.sessionStorage.getItem('token')},
      fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    };
  },
  methods: {
    async handleAdd() {
      const res = await this.$http({
        url: 'goods',
        method: 'post',
        data: this.form
      });
      const { meta } = res.data;
      if (meta.status === 201) { // 添加成功
        this.$message({
          type: 'success',
          message: meta.msg
        });
      } else if (meta.status === 400) {
        this.$message({
          type: 'warning',
          message: meta.msg
        });
      }
    },
    handleGaiBianLe(data) {
      console.log(data);
      this.form.goods_cat = data.join(',');
    },
    onEditorBlur () {
      console.log('onEditorBlur');
    },
    onEditorFocus () {
      console.log('onEditorFocus');
    },
    onEditorReady () {
      console.log('onEditorReady');
    },
    handleNextStep () {
      this.activeName = Number.parseInt(this.activeName) + 1 + '';
      this.stepActive++;
    },
      // 处理 tabs 标签点击事件
    handleTabClick (tab, event) {
      // console.log('handleTabClick')
      // console.log(tab.index)
      this.stepActive = tab.index - 0;
    },
    // 图片上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
