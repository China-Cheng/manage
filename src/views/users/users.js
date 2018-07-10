export default {
  data() {
    return {
      // 用户列表数据
      list: [],
      // true显示正在加载，false的时候不显示
      loading: true,
      // 分页相关数据
      pagenum: 1,
      pagesize: 6,
      total: 0,
      // 绑定搜索文本框
      searchValue: '',
      // 控制添加用户的对话框显示隐藏
      addUserDialogVisible: false,
      // 控制修改对话框是否显示隐藏
      editUserDialogVisible: false,
      // 控制角色对话框是否显示隐藏
      setUserDialogVisible: false,
      // 分配角色需要的数据
      currentUserName: '',
      currentRoleId: -1,
      currentID: '',
      roles: [],
      formData: {
        username: '',
        password: '',
        email: '',
        nibile: ''
      },
      // 表单验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择密码', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 发送请求获取数据
    this.loadData();
  },
  methods: {
    // 发送异步请求，获取数据
    async loadData() {
      // 发送异步请求之前
      this.loading = true;

      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);

      // 异步请求结束
      this.loading = false;

      // 获取响应数据
      const data = res.data;
      // meta中的msg 和 status
      const { meta: { msg, status } } = data;
      if (status === 200) {
        const { data: { users, total } } = data;
        this.list = users;
        // 获取总共多少条数据
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页导航条
    handleSizeChange(val) {
      // 每页条数改变的时候
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      // 当页码改变的时候
      this.pagenum = val;
      this.loadData();
    },
    // 搜索按钮
    handleSearch () {
      this.loadData();
    },
    // 当开关的状态发生改变
    async handleSwitchChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      // 拿到返回的数据
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除数据
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确定按钮执行
        // 包裹await的函数都要加上async
        const res = await this.$http.delete(`users/${id}`);
        // 返回的数据
        const data = res.data;
        const { meta: {status, msg} } = data;
        // 判断status
        if (status === 200) {
          this.pagenum = 1;
          this.loadData();
          this.$message({
            type: 'success',
            message: msg
          });
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加数据
    async handleAdd() {
      // 表单的DOM对象
      this.$refs.formName.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入完整内容');
        }
        // 验证成功执行添加
        const res = await this.$http.post('users', this.formData);
        // 拿到数据
        const data = res.data;
        const { meta: {status, msg} } = data;
        // 判断
        if (status === 201) {
          // 添加成功
          this.$message.success(msg);
          // 隐藏对话框
          this.addUserDialogVisible = false;
          // 重新渲染页面
          this.loadData();
          // 清空输入表单值
          // for (let key in this.formData) {
          //   this.formData[key] = '';
          // };
          // this.formData = {brand_right: 0};
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 点击修改按钮，弹出修改对话框
    handleShowEditDialog(user) {
      // 显示对话框
      this.editUserDialogVisible = true;
      // 文本框显示内容
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      this.formData.id = user.id;
    },
    // 点击修改按钮，发送请求修改内容
    async handleEdit() {
      // 拿到当前这行id，因为在修改的时候id已经赋值给了formData,所以可以拿到
      const id = this.formData.id;
      const mobile = this.formData.mobile;
      const email = this.formData.email;
      const res = await this.$http.put(`users/${id}`, {mobile, email});
      const data = res.data;
      const { meta: {status, msg} } = data;
      // 判断
      if (status === 200) {
        // 修改成功
        this.$message.success(msg);
        // 关闭对话框
        this.editUserDialogVisible = false;
        // 重新渲染页面
        this.loadData();
      } else {
        this.message.error(msg);
      }
    },
    // 添加和修改对话框关闭以后执行
    hanleClosed() {
      this.formData = {brand_right: 0};
    },
    // 点击角色分配显示对话框
    async handleSHowSetRoleDialog(user) {
      this.currentID = user.id;
      // 显示当前角色名字
      this.currentUserName = user.username;
      // 显示对话框
      this.setUserDialogVisible = true;
      // 获取所有角色
      const res = await this.$http.get('roles');
      this.roles = res.data.data;
      // 根据用户id查询角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res2.data.data.rid;
    },
    // 点击角色分配确定，分配角色
    async handleSetRole() {
      const res = await this.$http.put(`users/${this.currentID}/role`, {rid: this.currentRoleId});
      const data = res.data;
      const { meta: {status, msg} } = data;
      if (status === 200) {
        this.setUserDialogVisible = false;
        this.$message.success(msg);
        this.currentUserName = '';
        this.currentID = -1;
        this.currentRoleId = -1;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
