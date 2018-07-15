<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>

   <!-- 添加按钮 -->
   <el-row class="row-add">
      <el-col :span="24">
        <el-button @click="handleShowAdd" type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <!-- tree grid
        treeKey 绑定到id，给每一个节点设置一个唯一值
        parentKey 绑定到父id属性，区分父子节点
        levelKey 绑定到层级的属性
        childKey 绑定到存储子元素的属性
       -->
      <!-- <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid> -->
      <el-tree-grid
      prop="cat_name"
      label="分类名称"
      treeKey="cat_id"
      parenKey="cat_pid"
      levelKey="cat_level"
      childKey="children"
      :indentSize="30"
      >
      </el-tree-grid>

      <el-table-column
        label="分类名称"
        prop="cat_name"
        width="180">
      </el-table-column>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleShowEdit(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button @click="handleDelete(scope.row)" plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加数据的表单 -->
    <el-dialog title="编辑分类" :visible.sync="addFormDialog">
      <el-form :model="addForm" ref="addForm">

        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            clearable
            placeholder="默认是一级分类"
            expand-trigger="hover"
            :options="options"
            change-on-select
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children'
            }"
            v-model="selectedOptions2">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑数据的表单 -->
     <el-dialog title="编辑分类" :visible.sync="editFormDialog">
      <el-form :model="editForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 1. npm install element-tree-grid
// 2. 引入组件
// 3. 局部注册组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      list: [],
      loading: true,
      // 分页数据
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 添加数据
      addFormDialog: false,
      addForm: {
        cat_name: ''
      },
      selectedOptions2: [],
      options: [],
      // 编辑分类
      editFormDialog: false,
      editForm: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 渲染数据
    async loadData() {
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;

      const { data: { result, total } } = resData;
      this.list = result;
      // 获取总条数
      this.total = total;
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    // 点击弹出添加框
    async handleShowAdd() {
      // 显示对话框
      this.addFormDialog = true;
      // 获取数据绑定到级联选择器中
      const res = await this.$http.get('categories', {
        params: {
          type: 2
        }
      });
      this.options = res.data.data;
    },
    // 处理添加分类
    async handleAdd() {
      let catPid = 0;
      if (this.selectedOptions2[0]) {
        catPid = this.selectedOptions2[this.selectedOptions2.length - 1];
      };
      const addForm = {
        ...this.addForm,
        cat_pid: catPid,
        cat_level: this.selectedOptions2.length
      };
      const { data: resData } = await this.$http({
        url: '/categories',
        method: 'post',
        data: addForm
      });
      const { meta: { status, msg } } = resData;
      if (status === 201) {
        this.$message.success(msg);
        this.loadData();
        this.addFormDialog = false;
        this.$refs['addForm'].resetFields();
        this.selectedOptions2 = [];
      } else {
        this.$message.error(msg);
      }
    },
    // 删除分类
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: {meta: {status, msg}}} = await this.$http.delete(`categories/${row.cat_id}`);
        if (status === 200) {
          this.$message.success(msg);
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑分类
    handleShowEdit(row) {
      this.editForm = row;
      this.editFormDialog = true;
    },
    // 编辑分类修改
    async handleEdit() {
      const { data: resData } = await this.$http({
        url: `categories/${this.editForm.cat_id}`,
        data: { cat_name: this.editForm.cat_name },
        method: 'put'
      });
      const { meta: {status, msg} } = resData;
      if (status === 200) {
        this.editFormDialog = false;
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  },
  components: {
    ElTreeGrid
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
