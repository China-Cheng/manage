<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>

    <el-row :span="24" class="row-add">
    <!-- 添加按钮 -->
    <el-button>添加角色</el-button>
    </el-row>

     <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>

      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="handleEdit(scope.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size="mini" type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      // 数据加载延迟
      loading: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载角色列表
    async loadData() {
      this.loading = true;
      // resData是服务器返回的数据
      const { data: resData } = await this.$http.get('roles');
      const { data, meta: {status, msg} } = resData;
      if (status === 200) {
        this.list = data;
      } else {
        this.$message.error(msg);
      }
      this.loading = false;
    }
  }
};
</script>

<style>
.row-add {
  margin: 10px 0;
}
</style>
